<?php

namespace App\Http\Controllers;

<<<<<<< HEAD
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Khởi tạo query từ Model Product
        $query = Product::query();

        // 1. Tìm kiếm theo tên
        if ($request->has('keyword')) {
            $query->where('name', 'like', '%' . $request->keyword . '%');
        }

        // 2. Lọc theo danh mục
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // 3. Lọc theo khoảng giá
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // 4. Sắp xếp
        if ($request->has('sort')) {
            if ($request->sort == 'price_asc') $query->orderBy('price', 'asc');
            if ($request->sort == 'price_desc') $query->orderBy('price', 'desc');
            if ($request->sort == 'newest') $query->orderBy('created_at', 'desc');
        }

        return response()->json($query->paginate(10)); // Trả về dạng JSON phân trang
=======
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Lấy danh sách toàn bộ danh mục hiển thị lên trang chủ
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    // Lấy thông tin chi tiết 1 danh mục
    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }
        return response()->json(['success' => true, 'data' => $category]);
>>>>>>> 850014e7c93576d4c5831768d2a492695014519a
    }
}