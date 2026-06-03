<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Hàm gửi bình luận, đánh giá sản phẩm
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'CustomerID' => 'required|exists:users,UserID',
            'ProductID' => 'required|exists:products,ProductID',
            'RatingValue' => 'required|integer|min:1|max:5',
            'Comment' => 'nullable|string',
        ]);

        $review = Review::create($validatedData);

        return response()->json(['message' => 'Cảm ơn bạn đã đánh giá sản phẩm!', 'review' => $review], 201);
    }
    
    // Lấy danh sách đánh giá của 1 sản phẩm (hỗ trợ hiển thị)
    public function getProductReviews($productId)
    {
        $reviews = Review::where('ProductID', $productId)->with('customer')->get();
        return response()->json($reviews, 200);
    }
}