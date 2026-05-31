<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateProductRequest;



class ProductController extends Controller
{
    public function destroy($id)
{
    $product = Product::findOrFail($id);
    $product->delete(); // Laravel tự động thực hiện xóa mềm (soft delete)

    return response()->json(['message' => 'Sản phẩm đã được xóa (xóa mềm)']);
}

// Hàm hỗ trợ Tắt bán (nếu bạn dùng cột is_active/status)
public function toggleStatus($id)
{
    $product = Product::findOrFail($id);
    $product->is_active = !$product->is_active; // Đảo trạng thái
    $product->save();

    return response()->json(['message' => 'Đã thay đổi trạng thái bán', 'is_active' => $product->is_active]);
}
public function store(StoreProductRequest $request)
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        // Lưu ảnh vào thư mục storage/app/public/products
        $path = $request->file('image')->store('products', 'public');
        $data['image_url'] = $path; // Lưu đường dẫn vào database
    }

    $product = Product::create($data);
    return response()->json($product, 201);
}
    public function update(UpdateProductRequest $request, $id)
{
    $product = Product::findOrFail($id);
    $product->update($request->validated());

    return response()->json([
        'message' => 'Cập nhật sản phẩm thành công',
        'data' => $product
    ]);
}
    public function index(Request $request)
{
    $products = Product::filter($request->only(['keyword', 'category_id', 'min_price', 'max_price']))
                       ->sort($request->sort)
                       ->paginate(10);

    return response()->json($products);
}
}