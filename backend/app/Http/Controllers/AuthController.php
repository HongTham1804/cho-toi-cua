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
            'name.required' => 'Vui lòng nhập họ và tên.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.regex' => 'Số điện thoại phải nhập đúng 10 chữ số.',
            'phone.unique' => 'Số điện thoại này đã được đăng ký.',
        ]);

        $user->forceFill($validated)->save();

        return response()->json([
            'message' => 'Cập nhật tài khoản thành công.',
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
            'name.required' => 'Vui lòng nhập họ và tên.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.regex' => 'Số điện thoại phải nhập đúng 10 chữ số.',
            'phone.unique' => 'Số điện thoại này đã được đăng ký.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email này đã được đăng ký.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
        ]);

        $pendingWithPhone = PendingRegistration::query()
            ->where('phone', $validated['phone'])
            ->where('email', '!=', $validated['email'])
            ->first();

        if ($pendingWithPhone) {
            throw ValidationException::withMessages([
                'phone' => ['Số điện thoại này đang chờ xác minh OTP.'],
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
                "Mã OTP đăng ký Chợ Tới Cửa của bạn là: {$otp}\n\nMã này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này cho người khác.",
                function ($message) use ($validated): void {
                    $message
                        ->to($validated['email'], $validated['name'])
                        ->subject('Mã OTP đăng ký Chợ Tới Cửa');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Không gửi được OTP. Vui lòng kiểm tra cấu hình Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP đã được gửi đến email của bạn.',
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
            'email.required' => 'Thiếu email xác minh.',
            'email.email' => 'Email không hợp lệ.',
            'otp.required' => 'Vui lòng nhập mã OTP.',
            'otp.digits' => 'Mã OTP phải gồm 6 số.',
        ]);

        $pending = PendingRegistration::where('email', $validated['email'])->first();

        if (! $pending) {
            return response()->json([
                'message' => 'Không tìm thấy yêu cầu đăng ký đang chờ xác minh.',
            ], 404);
        }

        if ($pending->expires_at->isPast()) {
            $pending->delete();

            return response()->json([
                'message' => 'Mã OTP đã hết hạn. Vui lòng đăng ký lại để nhận mã mới.',
            ], 422);
        }

        if ($pending->attempts >= 5) {
            $pending->delete();

            return response()->json([
                'message' => 'Bạn đã nhập sai OTP quá nhiều lần. Vui lòng đăng ký lại.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $pending->otp_hash)) {
            $pending->increment('attempts');

            return response()->json([
                'message' => 'Mã OTP không đúng.',
            ], 422);
        }

        if (User::where('email', $pending->email)->orWhere('phone', $pending->phone)->exists()) {
            $pending->delete();

            return response()->json([
                'message' => 'Email hoặc số điện thoại đã được đăng ký.',
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
            'message' => 'Đăng ký thành công. Vui lòng đăng nhập lại.',
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
            'store_name.required' => 'Vui lòng nhập tên siêu thị.',
            'name.required' => 'Vui lòng nhập họ tên người đại diện.',
            'phone.regex' => 'Số điện thoại phải nhập đúng 10 chữ số.',
            'phone.unique' => 'Số điện thoại này đã được đăng ký.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email này đã được đăng ký.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
        ]);

        $store = $this->resolvePartnerStore($validated['store_name'], $validated['store_address'] ?? null);

        if (! $store) {
            return response()->json([
                'message' => 'Hiện hệ thống chỉ nhận đăng ký cho Bách Hóa Xanh Lê Văn Chí, WinMart Lê Văn Việt hoặc GO! Dĩ An.',
            ], 422);
        }

        $pendingWithPhone = PendingRegistration::query()
            ->where('phone', $validated['phone'])
            ->where('email', '!=', $validated['email'])
            ->first();

        if ($pendingWithPhone) {
            throw ValidationException::withMessages([
                'phone' => ['Số điện thoại này đang chờ xác minh OTP.'],
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
                "Mã OTP đăng ký đối tác Chợ Tới Cửa của bạn là: {$otp}\n\nMã này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này cho người khác.",
                function ($message) use ($validated): void {
                    $message
                        ->to($validated['email'], $validated['name'])
                        ->subject('Mã OTP đăng ký đối tác Chợ Tới Cửa');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Không gửi được OTP. Vui lòng kiểm tra cấu hình Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP đã được gửi đến email đối tác.',
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
                'message' => 'Không tìm thấy yêu cầu đăng ký đối tác đang chờ xác minh.',
            ], 404);
        }

        if ($pending->expires_at->isPast()) {
            $pending->delete();

            return response()->json([
                'message' => 'Mã OTP đã hết hạn. Vui lòng đăng ký lại để nhận mã mới.',
            ], 422);
        }

        if ($pending->attempts >= 5) {
            $pending->delete();

            return response()->json([
                'message' => 'Bạn đã nhập sai OTP quá nhiều lần. Vui lòng đăng ký lại.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $pending->otp_hash)) {
            $pending->increment('attempts');

            return response()->json([
                'message' => 'Mã OTP không đúng.',
            ], 422);
        }

        if (User::where('email', $pending->email)->orWhere('phone', $pending->phone)->exists()) {
            $pending->delete();

            return response()->json([
                'message' => 'Email hoặc số điện thoại đã được đăng ký.',
            ], 422);
        }

        $store = $this->resolvePartnerStore($pending->store_name, $pending->store_address);

        if (! $store) {
            return response()->json([
                'message' => 'Siêu thị đăng ký không hợp lệ.',
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
            'message' => 'Đăng ký đối tác thành công. Vui lòng đăng nhập lại.',
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
            'identifier.required' => 'Vui lòng nhập email hoặc số điện thoại.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
        ]);

        $identifier = $validated['identifier'];
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($field, $identifier)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Thông tin đăng nhập không đúng.',
            ], 422);
        }

        if ($user->isLocked()) {
            return response()->json([
                'message' => 'Tài khoản đang bị khóa đến ' . $user->locked_until->format('d/m/Y') . '.',
            ], 423);
        }

        return response()->json([
            'message' => 'Đăng nhập thành công.',
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
            'identifier.required' => 'Vui lòng nhập email hoặc số điện thoại.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
        ]);

        $identifier = $validated['identifier'];
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::with('stores')->where($field, $identifier)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password) || $user->role !== 'partner') {
            return response()->json([
                'message' => 'Thông tin đăng nhập đối tác không đúng.',
            ], 422);
        }

        $fixedPartnerEmails = $this->fixedPartnerEmails();
        if ($fixedPartnerEmails !== [] && ! in_array(strtolower($user->email), $fixedPartnerEmails, true)) {
            return response()->json([
                'message' => 'Tài khoản đối tác không thuộc 3 siêu thị được cấu hình.',
            ], 422);
        }

        if ($user->isLocked()) {
            return response()->json([
                'message' => 'Tài khoản đối tác đang bị khóa đến ' . $user->locked_until->format('d/m/Y') . '.',
            ], 423);
        }

        return response()->json([
            'message' => 'Đăng nhập đối tác thành công.',
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
            'identifier.required' => 'Vui lòng nhập email hoặc số điện thoại.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
        ]);

        $identifier = $validated['identifier'];
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($field, $identifier)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password) || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Thông tin đăng nhập quản trị không đúng.',
            ], 422);
        }

        if ($user->isLocked()) {
            return response()->json([
                'message' => 'Tài khoản quản trị đang bị khóa đến ' . $user->locked_until->format('d/m/Y') . '.',
            ], 423);
        }

        return response()->json([
            'message' => 'Đăng nhập quản trị thành công.',
            'token' => $user->createToken('admin-web')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function adminMe(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập trang quản trị.',
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
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return response()->json([
                'message' => 'Không tìm thấy tài khoản với email này.',
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
                "Mã OTP đặt lại mật khẩu Chợ Tới Cửa của bạn là: {$otp}\n\nMã này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này cho người khác.",
                function ($message) use ($user): void {
                    $message
                        ->to($user->email, $user->name)
                        ->subject('Mã OTP đặt lại mật khẩu Chợ Tới Cửa');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Không gửi được OTP. Vui lòng kiểm tra cấu hình Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP đặt lại mật khẩu đã được gửi đến email của bạn.',
            'email' => $validated['email'],
            'expires_in_minutes' => 10,
        ]);
    }

    public function sendPartnerForgotPasswordOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
        ]);

        $user = User::where('email', $validated['email'])
            ->where('role', 'partner')
            ->first();

        if (! $user) {
            return response()->json([
                'message' => 'Không tìm thấy tài khoản đối tác với email này.',
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
                "Mã OTP đặt lại mật khẩu đối tác Chợ Tới Cửa của bạn là: {$otp}\n\nMã này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này cho người khác.",
                function ($message) use ($user): void {
                    $message
                        ->to($user->email, $user->name)
                        ->subject('Mã OTP đặt lại mật khẩu đối tác Chợ Tới Cửa');
                }
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Không gửi được OTP. Vui lòng kiểm tra cấu hình Gmail trong file .env.',
            ], 500);
        }

        return response()->json([
            'message' => 'OTP đặt lại mật khẩu đối tác đã được gửi đến email.',
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
            'email.required' => 'Thiếu email xác minh.',
            'email.email' => 'Email không hợp lệ.',
            'otp.required' => 'Vui lòng nhập mã OTP.',
            'otp.digits' => 'Mã OTP phải gồm 6 số.',
        ]);

        $passwordResetOtp = PasswordResetOtp::where('email', $validated['email'])->first();

        if (! $passwordResetOtp) {
            return response()->json([
                'message' => 'Không tìm thấy yêu cầu đặt lại mật khẩu.',
            ], 404);
        }

        if ($passwordResetOtp->expires_at->isPast()) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.',
            ], 422);
        }

        if ($passwordResetOtp->attempts >= 5) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu mã mới.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $passwordResetOtp->otp_hash)) {
            $passwordResetOtp->increment('attempts');

            return response()->json([
                'message' => 'Mã OTP không đúng.',
            ], 422);
        }

        $resetToken = Str::random(64);

        $passwordResetOtp->update([
            'reset_token_hash' => Hash::make($resetToken),
            'verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Xác minh OTP thành công. Bạn có thể đặt lại mật khẩu.',
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
            'email.required' => 'Thiếu email đặt lại mật khẩu.',
            'email.email' => 'Email không hợp lệ.',
            'reset_token.required' => 'Phiên đặt lại mật khẩu không hợp lệ.',
            'password.required' => 'Vui lòng nhập mật khẩu mới.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
        ]);

        $passwordResetOtp = PasswordResetOtp::where('email', $validated['email'])->first();

        if (! $passwordResetOtp || ! $passwordResetOtp->verified_at || ! $passwordResetOtp->reset_token_hash) {
            return response()->json([
                'message' => 'Vui lòng xác minh OTP trước khi đặt lại mật khẩu.',
            ], 422);
        }

        if ($passwordResetOtp->expires_at->isPast()) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'Phiên đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu mã OTP mới.',
            ], 422);
        }

        if (! Hash::check($validated['reset_token'], $passwordResetOtp->reset_token_hash)) {
            return response()->json([
                'message' => 'Phiên đặt lại mật khẩu không hợp lệ.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            $passwordResetOtp->delete();

            return response()->json([
                'message' => 'Không tìm thấy tài khoản với email này.',
            ], 404);
        }

        $user->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        $passwordResetOtp->delete();

        return response()->json([
            'message' => 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.',
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
