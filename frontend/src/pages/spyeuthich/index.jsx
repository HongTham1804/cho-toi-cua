import React from 'react';
import './index.css';
import { Search, Bell, HelpCircle, Grid, Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';

export default function FavoriteProducts() {
  const favoriteItems = [
    {
      id: 1,
      name: 'Chuối già Nam Mỹ Export loại 1 (Nải 1kg)',
      price: '35.000đ',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&auto=format&fit=crop&q=80',
      store: 'Co.opmart Cống Quỳnh',
      storeColor: 'bg-blue-100 text-blue-700',
      tag: 'Còn hàng',
      tagColor: 'bg-emerald-100 text-emerald-700',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Cam sành Vĩnh Long mọng nước (1kg)',
      price: '45.000đ',
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=300&auto=format&fit=crop&q=80',
      store: 'Lotte Mart Q7',
      storeColor: 'bg-sky-100 text-sky-700',
      tag: 'Sắp hết',
      tagColor: 'bg-amber-100 text-amber-700',
      rating: 4.6,
      reviews: 98
    },
    {
      id: 3,
      name: 'Thịt ba rọi heo CP chuẩn VietGAP (500g)',
      price: '85.000đ',
      image: 'https://images.unsplash.com/photo-1602470520998-f4a5004cc7ab?w=300&auto=format&fit=crop&q=80',
      store: 'Co.opmart Cống Quỳnh',
      storeColor: 'bg-blue-100 text-blue-700',
      tag: 'Còn hàng',
      tagColor: 'bg-emerald-100 text-emerald-700',
      rating: 4.9,
      reviews: 256
    },
    {
      id: 4,
      name: 'Rau muống nước tươi sạch mớ lớn (500g)',
      price: '15.000đ',
      image: 'https://images.unsplash.com/photo-1628773822503-930a845949d6?w=300&auto=format&fit=crop&q=80',
      store: 'Big C Miền Đông',
      storeColor: 'bg-green-100 text-green-700',
      tag: 'Hết hàng',
      tagColor: 'bg-rose-100 text-rose-700',
      rating: 4.2,
      reviews: 43
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased text-xs">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E2E8F0] h-14 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#94A3B8]">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm yêu thích..." 
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs focus:outline-none focus:border-[#047857] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="text-[#94A3B8] hover:text-[#64748B] p-1.5 rounded-full hover:bg-[#F1F5F9]">
            <Bell size={18} />
          </button>
          <button className="text-[#94A3B8] hover:text-[#64748B] p-1.5 rounded-full hover:bg-[#F1F5F9]">
            <HelpCircle size={18} />
          </button>
          <button className="text-[#94A3B8] hover:text-[#64748B] p-1.5 rounded-full hover:bg-[#F1F5F9]">
            <Grid size={18} />
          </button>
          <div className="h-6 w-px bg-[#E2E8F0] mx-1"></div>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
          />
        </div>
      </header>

      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={20} />
              <h1 className="text-xl font-bold text-[#0F172A]">Sản phẩm yêu thích</h1>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">Danh sách các sản phẩm bạn đã lưu và thường xuyên quan tâm tại các siêu thị.</p>
          </div>
          <span className="text-xs font-semibold text-[#475569] bg-[#E2E8F0] px-3 py-1.5 rounded-full">
            Đã lưu {favoriteItems.length} sản phẩm
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteItems.map((item) => (
            <div key={item.id} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative">
              
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-[#E2E8F0]">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm ${item.storeColor}`}>
                  {item.store}
                </span>

                <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#0F172A] text-xs leading-snug line-clamp-2 min-h-[32px]">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 mt-2 text-[#64748B] text-[11px]">
                    <div className="flex items-center text-amber-500">
                      <Star size={12} className="fill-amber-500" />
                      <span className="font-bold ml-0.5 text-[#0F172A]">{item.rating}</span>
                    </div>
                    <span>•</span>
                    <span>({item.reviews} đánh giá)</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block uppercase font-bold tracking-wider">Giá sản phẩm</span>
                    <span className="text-sm font-black text-[#047857]">{item.price}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors border border-[#E2E8F0] hover:border-[#FCA5A5]">
                      <Trash2 size={14} />
                    </button>
                    
                    <button 
                      disabled={item.tag === 'Hết hàng'}
                      className={`flex items-center gap-1 px-3 py-2 text-white font-semibold rounded-lg shadow-sm transition-colors ${
                        item.tag === 'Hết hàng' 
                          ? 'bg-[#CBD5E1] cursor-not-allowed shadow-none' 
                          : 'bg-[#047857] hover:bg-[#065F46]'
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>Chọn mua</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
