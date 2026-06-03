<?php

namespace App\Http\Controllers;

use App\Models\PendingRegistration;
use App\Models\PasswordResetOtp;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => [
                'required',
                'string',
                'regex:/^[0-9]{10}$/',
                Rule::unique('users', 'phone')->ignore($user->id),
            ],
        ], [
            'name.required' => 'Vui lÃ²ng nháº­p há» vÃ  tÃªn.',
            'phone.required' => 'Vui lÃ²ng nháº­p sá»‘ Ä‘iá»‡n thoáº¡i.',
            'phone.regex' => 'Sá»‘ Ä‘iá»‡n thoáº¡i pháº£i nháº­p Ä‘Ãºng 10 chá»¯ sá»‘.',
            'phone.unique' => 'Sá»‘ Ä‘iá»‡n thoáº¡i nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.',
        ]);

        $user->forceFill($validated)->save();

        return response()->json([
            'message' => 'Cáº­p nháº­t tÃ i khoáº£n thÃ nh cÃ´ng.',
            'user' => $user->fresh(),
        ]);
    }

    public function sendRegisterOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^[0-9]{10}$/', 'unique:users,phone'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Vui lÃ²ng nháº­p há» vÃ  tÃªn.',
            'phone.required' => 'Vui lÃ²ng nháº­p sá»‘ Ä‘iá»‡n thoáº¡i.',
            'phone.regex' => 'Sá»‘ Ä‘iá»‡n thoáº¡i pháº£i nháº­p Ä‘Ãºng 10 chá»¯ sá»‘.',
            'phone.unique' => 'Sá»‘ Ä‘iá»‡n thoáº¡i nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.',
            'email.required' => 'Vui lÃ²ng nháº­p email.',
            'email.email' => 'Email khÃ´ng há»£p lá»‡.',
            'email.unique' => 'Email nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.',
            'password.required' => 'Vui lÃ²ng nháº­p máº­t kháº©u.',
            'password.min' => 'Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±.',
            'password.confirmed' => 'XÃ¡c nháº­n máº­t kháº©u khÃ´ng khá»›p.',
        ]);

        $pendingWithPhone = PendingRegistration::query()
            ->where('phone', $validated['phone'])
            ->where('email', '!=', $validated['email'])
            ->first();

        if ($pendingWithPhone) {
            throw ValidationException::withMessages([
                'phone' => ['Sá»‘ Ä‘iá»‡n thoáº¡i nÃ y Ä‘ang chá» xÃ¡c minh OTP.'],
            ]);
        }

        $otp = (string) random_int(100000, 999999);

        PendingRegistration::updateOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'password_hash' => Hash::make($validated['password']),
                'otp_hash' => Hash::make($otp),
                'expires_at' => now()->addMinutes(10),
                'attempts' => 0,
            ]
        );

        try {
            Mail::raw(
                "MÃ£ OTP Ä‘Äƒng kÃ½ Chá»£ Tá»›i Cá»­a cá»§a báº¡n lÃ : {$otp}\n\nMÃ£ nÃ y cÃ³ hiá»‡u lá»±c trong 10 phÃºt. Vui lÃ²ng khÃ´ng chia sáº» mÃ£ nÃ y cho ngÆ°á»i khÃ¡c.",
                function ($message) use ($validated): void {
                    $message
                        ->to($validated['email'], $validated['name'])
                        ->subject('MÃ£ OTP Ä‘Äƒng kÃ½ Chá»£ Tá»›i Cá»­a');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'KhÃ´ng gá»­i Ä‘Æ°á»£c OTP. Vui lÃ²ng kiá»ƒm tra cáº¥u hÃ¬nh Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP Ä‘Ã£ Ä‘Æ°á»£c gá»­i Ä‘áº¿n email cá»§a báº¡n.',
            'email' => $validated['email'],
            'expires_in_minutes' => 10,
        ]);
    }

    public function verifyRegisterOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
        ], [
            'email.required' => 'Thiáº¿u email xÃ¡c minh.',
            'email.email' => 'Email khÃ´ng há»£p lá»‡.',
            'otp.required' => 'Vui lÃ²ng nháº­p mÃ£ OTP.',
            'otp.digits' => 'MÃ£ OTP pháº£i gá»“m 6 sá»‘.',
        ]);

        $pending = PendingRegistration::where('email', $validated['email'])->first();

        if (! $pending) {
            return response()->json([
                'message' => 'KhÃ´ng tÃ¬m tháº¥y yÃªu cáº§u Ä‘Äƒng kÃ½ Ä‘ang chá» xÃ¡c minh.',
            ], 404);
        }

        if ($pending->expires_at->isPast()) {
            $pending->delete();

            return response()->json([
                'message' => 'MÃ£ OTP Ä‘Ã£ háº¿t háº¡n. Vui lÃ²ng Ä‘Äƒng kÃ½ láº¡i Ä‘á»ƒ nháº­n mÃ£ má»›i.',
            ], 422);
        }

        if ($pending->attempts >= 5) {
            $pending->delete();

            return response()->json([
                'message' => 'Báº¡n Ä‘Ã£ nháº­p sai OTP quÃ¡ nhiá»u láº§n. Vui lÃ²ng Ä‘Äƒng kÃ½ láº¡i.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $pending->otp_hash)) {
            $pending->increment('attempts');

            return response()->json([
                'message' => 'MÃ£ OTP khÃ´ng Ä‘Ãºng.',
            ], 422);
        }

        if (User::where('email', $pending->email)->orWhere('phone', $pending->phone)->exists()) {
            $pending->delete();

            return response()->json([
                'message' => 'Email hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.',
            ], 422);
        }

        $user = User::create([
            'name' => $pending->name,
            'phone' => $pending->phone,
            'email' => $pending->email,
            'password' => $pending->password_hash,
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        $pending->delete();

        return response()->json([
            'message' => 'ÄÄƒng kÃ½ thÃ nh cÃ´ng. Vui lÃ²ng Ä‘Äƒng nháº­p láº¡i.',
            'user' => $user,
        ], 201);
    }

    public function sendPartnerRegisterOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_name' => ['required', 'string', 'max:255'],
            'store_address' => ['nullable', 'string', 'max:500'],
            'business_type' => ['nullable', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^[0-9]{10}$/', 'unique:users,phone'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'store_name.required' => 'Vui lÃ²ng nháº­p tÃªn siÃªu thá»‹.',
            'name.required' => 'Vui lÃ²ng nháº­p há» tÃªn ngÆ°á»i Ä‘áº¡i diá»‡n.',
            'phone.regex' => 'Sá»‘ Ä‘iá»‡n thoáº¡i pháº£i nháº­p Ä‘Ãºng 10 chá»¯ sá»‘.',
            'phone.unique' => 'Sá»‘ Ä‘iá»‡n thoáº¡i nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.',
            'email.email' => 'Email khÃ´ng há»£p lá»‡.',
            'email.unique' => 'Email nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.',
            'password.min' => 'Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±.',
            'password.confirmed' => 'XÃ¡c nháº­n máº­t kháº©u khÃ´ng khá»›p.',
        ]);

        $store = $this->resolvePartnerStore($validated['store_name'], $validated['store_address'] ?? null);

        if (! $store) {
            return response()->json([
                'message' => 'Hiá»‡n há»‡ thá»‘ng chá»‰ nháº­n Ä‘Äƒng kÃ½ cho BÃ¡ch HÃ³a Xanh LÃª VÄƒn ChÃ­, WinMart LÃª VÄƒn Viá»‡t hoáº·c GO! DÄ© An.',
            ], 422);
        }

        $pendingWithPhone = PendingRegistration::query()
            ->where('phone', $validated['phone'])
            ->where('email', '!=', $validated['email'])
            ->first();

        if ($pendingWithPhone) {
            throw ValidationException::withMessages([
                'phone' => ['Sá»‘ Ä‘iá»‡n thoáº¡i nÃ y Ä‘ang chá» xÃ¡c minh OTP.'],
            ]);
        }

        $otp = (string) random_int(100000, 999999);

        PendingRegistration::updateOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'password_hash' => Hash::make($validated['password']),
                'role' => 'partner',
                'store_name' => $store->name,
                'store_address' => $store->address,
                'business_type' => $validated['business_type'] ?? null,
                'otp_hash' => Hash::make($otp),
                'expires_at' => now()->addMinutes(10),
                'attempts' => 0,
            ]
        );

        try {
            Mail::raw(
                "MÃ£ OTP Ä‘Äƒng kÃ½ Ä‘á»‘i tÃ¡c Chá»£ Tá»›i Cá»­a cá»§a báº¡n lÃ : {$otp}\n\nMÃ£ nÃ y cÃ³ hiá»‡u lá»±c trong 10 phÃºt. Vui lÃ²ng khÃ´ng chia sáº» mÃ£ nÃ y cho ngÆ°á»i khÃ¡c.",
                function ($message) use ($validated): void {
                    $message
                        ->to($validated['email'], $validated['name'])
                        ->subject('MÃ£ OTP Ä‘Äƒng kÃ½ Ä‘á»‘i tÃ¡c Chá»£ Tá»›i Cá»­a');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'KhÃ´ng gá»­i Ä‘Æ°á»£c OTP. Vui lÃ²ng kiá»ƒm tra cáº¥u hÃ¬nh Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP Ä‘Ã£ Ä‘Æ°á»£c gá»­i Ä‘áº¿n email Ä‘á»‘i tÃ¡c.',
            'email' => $validated['email'],
            'expires_in_minutes' => 10,
        ]);
    }

    public function verifyPartnerRegisterOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
        ]);

        $pending = PendingRegistration::where('email', $validated['email'])
            ->where('role', 'partner')
            ->first();

        if (! $pending) {
            return response()->json([
                'message' => 'KhÃ´ng tÃ¬m tháº¥y yÃªu cáº§u Ä‘Äƒng kÃ½ Ä‘á»‘i tÃ¡c Ä‘ang chá» xÃ¡c minh.',
            ], 404);
        }

        if ($pending->expires_at->isPast()) {
            $pending->delete();

            return response()->json([
                'message' => 'MÃ£ OTP Ä‘Ã£ háº¿t háº¡n. Vui lÃ²ng Ä‘Äƒng kÃ½ láº¡i Ä‘á»ƒ nháº­n mÃ£ má»›i.',
            ], 422);
        }

        if ($pending->attempts >= 5) {
            $pending->delete();

            return response()->json([
                'message' => 'Báº¡n Ä‘Ã£ nháº­p sai OTP quÃ¡ nhiá»u láº§n. Vui lÃ²ng Ä‘Äƒng kÃ½ láº¡i.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $pending->otp_hash)) {
            $pending->increment('attempts');

            return response()->json([
                'message' => 'MÃ£ OTP khÃ´ng Ä‘Ãºng.',
            ], 422);
        }

        if (User::where('email', $pending->email)->orWhere('phone', $pending->phone)->exists()) {
            $pending->delete();

            return response()->json([
                'message' => 'Email hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.',
            ], 422);
        }

        $store = $this->resolvePartnerStore($pending->store_name, $pending->store_address);

        if (! $store) {
            return response()->json([
                'message' => 'SiÃªu thá»‹ Ä‘Äƒng kÃ½ khÃ´ng há»£p lá»‡.',
            ], 422);
        }

        $user = User::create([
            'name' => $pending->name,
            'phone' => $pending->phone,
            'email' => $pending->email,
            'address' => $pending->store_address,
            'password' => $pending->password_hash,
            'role' => 'partner',
            'email_verified_at' => now(),
        ]);

        $store->update([
            'partner_id' => $user->id,
            'business_type' => $pending->business_type,
            'status' => 'active',
        ]);

        $pending->delete();

        return response()->json([
            'message' => 'ÄÄƒng kÃ½ Ä‘á»‘i tÃ¡c thÃ nh cÃ´ng. Vui lÃ²ng Ä‘Äƒng nháº­p láº¡i.',
            'user' => $user,
            'store' => $store->fresh(),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'identifier.required' => 'Vui long nhap email hoac so dien thoai.',
            'password.required' => 'Vui long nhap mat khau.',
        ]);

        $identifier = $validated['identifier'];
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($field, $identifier)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Thong tin dang nhap khong dung.',
            ], 422);
        }

        if ($user->isLocked()) {
            return response()->json([
                'message' => 'Tai khoan dang bi khoa den ' . $user->locked_until->format('d/m/Y') . '.',
            ], 423);
        }

        return response()->json([
            'message' => 'Dang nhap thanh cong.',
            'token' => $user->createToken('customer-web')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function partnerLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'identifier.required' => 'Vui long nhap email hoac so dien thoai.',
            'password.required' => 'Vui long nhap mat khau.',
        ]);

        $identifier = $validated['identifier'];
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::with('stores')->where($field, $identifier)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password) || $user->role !== 'partner') {
            return response()->json([
                'message' => 'Thong tin dang nhap doi tac khong dung.',
            ], 422);
        }

        $fixedPartnerEmails = $this->fixedPartnerEmails();
        if ($fixedPartnerEmails !== [] && ! in_array(strtolower($user->email), $fixedPartnerEmails, true)) {
            return response()->json([
                'message' => 'Tai khoan doi tac khong thuoc 3 sieu thi duoc cau hinh.',
            ], 422);
        }

        if ($user->isLocked()) {
            return response()->json([
                'message' => 'Tai khoan doi tac dang bi khoa den ' . $user->locked_until->format('d/m/Y') . '.',
            ], 423);
        }

        return response()->json([
            'message' => 'Dang nhap doi tac thanh cong.',
            'token' => $user->createToken('partner-web')->plainTextToken,
            'user' => $user,
            'store' => $user->stores->first(),
        ]);
    }

    private function fixedPartnerEmails(): array
    {
        return array_values(array_filter(array_map(
            fn ($email) => strtolower(trim((string) $email)),
            [
                env('PARTNER_BHX_EMAIL'),
                env('PARTNER_WINMART_EMAIL'),
                env('PARTNER_GO_EMAIL'),
            ]
        )));
    }

    public function adminLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'identifier.required' => 'Vui lÃ²ng nháº­p email hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i.',
            'password.required' => 'Vui lÃ²ng nháº­p máº­t kháº©u.',
        ]);

        $identifier = $validated['identifier'];
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($field, $identifier)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password) || $user->role !== 'admin') {
            return response()->json([
                'message' => 'ThÃ´ng tin Ä‘Äƒng nháº­p quáº£n trá»‹ khÃ´ng Ä‘Ãºng.',
            ], 422);
        }

        if ($user->isLocked()) {
            return response()->json([
                'message' => 'TÃ i khoáº£n quáº£n trá»‹ Ä‘ang bá»‹ khÃ³a Ä‘áº¿n ' . $user->locked_until->format('d/m/Y') . '.',
            ], 423);
        }

        return response()->json([
            'message' => 'ÄÄƒng nháº­p quáº£n trá»‹ thÃ nh cÃ´ng.',
            'token' => $user->createToken('admin-web')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function adminMe(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p trang quáº£n trá»‹.',
            ], 403);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    public function sendForgotPasswordOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Vui lÃ²ng nháº­p email.',
            'email.email' => 'Email khÃ´ng há»£p lá»‡.',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return response()->json([
                'message' => 'KhÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n vá»›i email nÃ y.',
            ], 404);
        }

        $otp = (string) random_int(100000, 999999);

        PasswordResetOtp::updateOrCreate(
            ['email' => $validated['email']],
            [
                'otp_hash' => Hash::make($otp),
                'reset_token_hash' => null,
                'expires_at' => now()->addMinutes(10),
                'verified_at' => null,
                'attempts' => 0,
            ]
        );

        try {
            Mail::raw(
                "MÃ£ OTP Ä‘áº·t láº¡i máº­t kháº©u Chá»£ Tá»›i Cá»­a cá»§a báº¡n lÃ : {$otp}\n\nMÃ£ nÃ y cÃ³ hiá»‡u lá»±c trong 10 phÃºt. Vui lÃ²ng khÃ´ng chia sáº» mÃ£ nÃ y cho ngÆ°á»i khÃ¡c.",
                function ($message) use ($user): void {
                    $message
                        ->to($user->email, $user->name)
                        ->subject('MÃ£ OTP Ä‘áº·t láº¡i máº­t kháº©u Chá»£ Tá»›i Cá»­a');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'KhÃ´ng gá»­i Ä‘Æ°á»£c OTP. Vui lÃ²ng kiá»ƒm tra cáº¥u hÃ¬nh Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP Ä‘áº·t láº¡i máº­t kháº©u Ä‘Ã£ Ä‘Æ°á»£c gá»­i Ä‘áº¿n email cá»§a báº¡n.',
            'email' => $validated['email'],
            'expires_in_minutes' => 10,
        ]);
    }

    public function sendPartnerForgotPasswordOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Vui lÃ²ng nháº­p email.',
            'email.email' => 'Email khÃ´ng há»£p lá»‡.',
        ]);

        $user = User::where('email', $validated['email'])
            ->where('role', 'partner')
            ->first();

        if (! $user) {
            return response()->json([
                'message' => 'KhÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n Ä‘á»‘i tÃ¡c vá»›i email nÃ y.',
            ], 404);
        }

        $otp = (string) random_int(100000, 999999);

        PasswordResetOtp::updateOrCreate(
            ['email' => $validated['email']],
            [
                'otp_hash' => Hash::make($otp),
                'reset_token_hash' => null,
                'expires_at' => now()->addMinutes(10),
                'verified_at' => null,
                'attempts' => 0,
            ]
        );

        try {
            Mail::raw(
                "MÃ£ OTP Ä‘áº·t láº¡i máº­t kháº©u Ä‘á»‘i tÃ¡c Chá»£ Tá»›i Cá»­a cá»§a báº¡n lÃ : {$otp}\n\nMÃ£ nÃ y cÃ³ hiá»‡u lá»±c trong 10 phÃºt. Vui lÃ²ng khÃ´ng chia sáº» mÃ£ nÃ y cho ngÆ°á»i khÃ¡c.",
                function ($message) use ($user): void {
                    $message
                        ->to($user->email, $user->name)
                        ->subject('MÃ£ OTP Ä‘áº·t láº¡i máº­t kháº©u Ä‘á»‘i tÃ¡c Chá»£ Tá»›i Cá»­a');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'KhÃ´ng gá»­i Ä‘Æ°á»£c OTP. Vui lÃ²ng kiá»ƒm tra cáº¥u hÃ¬nh Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP Ä‘áº·t láº¡i máº­t kháº©u Ä‘á»‘i tÃ¡c Ä‘Ã£ Ä‘Æ°á»£c gá»­i Ä‘áº¿n email.',
            'email' => $validated['email'],
            'expires_in_minutes' => 10,
        ]);
    }

    public function verifyForgotPasswordOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
        ], [
            'email.required' => 'Thiáº¿u email xÃ¡c minh.',
            'email.email' => 'Email khÃ´ng há»£p lá»‡.',
            'otp.required' => 'Vui lÃ²ng nháº­p mÃ£ OTP.',
            'otp.digits' => 'MÃ£ OTP pháº£i gá»“m 6 sá»‘.',
        ]);

        $passwordResetOtp = PasswordResetOtp::where('email', $validated['email'])->first();

        if (! $passwordResetOtp) {
            return response()->json([
                'message' => 'KhÃ´ng tÃ¬m tháº¥y yÃªu cáº§u Ä‘áº·t láº¡i máº­t kháº©u.',
            ], 404);
        }

        if ($passwordResetOtp->expires_at->isPast()) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'MÃ£ OTP Ä‘Ã£ háº¿t háº¡n. Vui lÃ²ng yÃªu cáº§u mÃ£ má»›i.',
            ], 422);
        }

        if ($passwordResetOtp->attempts >= 5) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'Báº¡n Ä‘Ã£ nháº­p sai OTP quÃ¡ nhiá»u láº§n. Vui lÃ²ng yÃªu cáº§u mÃ£ má»›i.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $passwordResetOtp->otp_hash)) {
            $passwordResetOtp->increment('attempts');

            return response()->json([
                'message' => 'MÃ£ OTP khÃ´ng Ä‘Ãºng.',
            ], 422);
        }

        $resetToken = Str::random(64);

        $passwordResetOtp->update([
            'reset_token_hash' => Hash::make($resetToken),
            'verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'XÃ¡c minh OTP thÃ nh cÃ´ng. Báº¡n cÃ³ thá»ƒ Ä‘áº·t láº¡i máº­t kháº©u.',
            'email' => $validated['email'],
            'reset_token' => $resetToken,
        ]);
    }

    public function resetForgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'reset_token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'email.required' => 'Thiáº¿u email Ä‘áº·t láº¡i máº­t kháº©u.',
            'email.email' => 'Email khÃ´ng há»£p lá»‡.',
            'reset_token.required' => 'PhiÃªn Ä‘áº·t láº¡i máº­t kháº©u khÃ´ng há»£p lá»‡.',
            'password.required' => 'Vui lÃ²ng nháº­p máº­t kháº©u má»›i.',
            'password.min' => 'Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±.',
            'password.confirmed' => 'XÃ¡c nháº­n máº­t kháº©u khÃ´ng khá»›p.',
        ]);

        $passwordResetOtp = PasswordResetOtp::where('email', $validated['email'])->first();

        if (! $passwordResetOtp || ! $passwordResetOtp->verified_at || ! $passwordResetOtp->reset_token_hash) {
            return response()->json([
                'message' => 'Vui lÃ²ng xÃ¡c minh OTP trÆ°á»›c khi Ä‘áº·t láº¡i máº­t kháº©u.',
            ], 422);
        }

        if ($passwordResetOtp->expires_at->isPast()) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'PhiÃªn Ä‘áº·t láº¡i máº­t kháº©u Ä‘Ã£ háº¿t háº¡n. Vui lÃ²ng yÃªu cáº§u mÃ£ OTP má»›i.',
            ], 422);
        }

        if (! Hash::check($validated['reset_token'], $passwordResetOtp->reset_token_hash)) {
            return response()->json([
                'message' => 'PhiÃªn Ä‘áº·t láº¡i máº­t kháº©u khÃ´ng há»£p lá»‡.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'KhÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n vá»›i email nÃ y.',
            ], 404);
        }

        $user->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        $passwordResetOtp->delete();

        return response()->json([
            'message' => 'Äáº·t láº¡i máº­t kháº©u thÃ nh cÃ´ng. Vui lÃ²ng Ä‘Äƒng nháº­p láº¡i.',
        ]);
    }

    private function resolvePartnerStore(?string $storeName, ?string $storeAddress = null): ?Store
    {
        $text = Str::of(trim(($storeName ?? '') . ' ' . ($storeAddress ?? '')))
            ->ascii()
            ->lower()
            ->squish()
            ->toString();

        if (str_contains($text, 'bach hoa xanh') && str_contains($text, 'le van chi')) {
            return Store::find(1);
        }

        if (str_contains($text, 'winmart') && str_contains($text, 'le van viet')) {
            return Store::find(2);
        }

        if (str_contains($text, 'go') && str_contains($text, 'di an')) {
            return Store::find(3);
        }

        return null;
    }
}
