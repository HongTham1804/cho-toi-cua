<?php

namespace App\Http\Controllers;

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
    }
}