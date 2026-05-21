import './index.css'
import bgImg from '../../assets/phone.png'
import '@fortawesome/fontawesome-free/css/all.min.css'

function RegisterStore() {
  return (
    <div className="registerContainer">

      {/* LEFT */}
      <div className="left-panel">
        <div className="overlay"></div>

        <div className="phone-frame">
         <img
          src={bgImg}
          alt="background"
        />

          <div className="info-card">
            <div className="registerLogo">
              <i className="fa-solid fa-leaf"></i>
              
            </div>

            <h1>Chợ Tới Cửa</h1>

            <p className="desc">
              Nền tảng kết nối nông sản sạch từ nông trại đến tận cửa nhà.
              Trở thành đối tác ngay hôm nay để mở rộng kinh doanh của bạn.
            </p>

            <div className="feature">
              <span><i className="fa-regular fa-circle-check"></i></span>
              <div>
                <h4>Tiếp cận khách hàng mới</h4>
                <p>Hàng ngàn khách hàng tiềm năng mỗi ngày.</p>
              </div>
            </div>

            <div className="feature">
              <span><i className="fa-solid fa-arrow-trend-up"></i></span>
              <div>
                <h4>Tăng trưởng doanh thu</h4>
                <p>Giải pháp bán hàng trực tuyến hiệu quả.</p>
              </div>
            </div>

            <div className="feature">
              <span><i className="fa-solid fa-headphones"></i></span>
              <div>
                <h4>Hỗ trợ 24/7</h4>
                <p>Đội ngũ chuyên gia luôn sẵn sàng giúp đỡ.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-panel">

        <div className="form-wrapper">
          <h2>Đăng ký Đối tác</h2>

          <p className="sub-title">
            Điền thông tin để bắt đầu bán hàng trên Chợ Tới Cửa.
          </p>

          <div className="card">
            <div className="card-title">
              <i className="fa-solid fa-store"></i>
              Thông tin cửa hàng
            </div>

            <div className="form-group">
              <label>Tên siêu thị/cửa hàng</label>

              <input
                type="text"
                placeholder="Nhập tên cửa hàng của bạn"
              />
            </div>

            <div className="form-group">
              <label>Loại hình kinh doanh</label>

              <select>
                <option>Chọn loại hình</option>
                <option>Siêu thị</option>
                <option>Cửa hàng thực phẩm</option>
                <option>Nông trại</option>
              </select>
            </div>

            <div className="form-group">
              <label>Địa chỉ kinh doanh</label>

              <textarea
                placeholder="Nhập địa chỉ chi tiết"
              ></textarea>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <i className="fa-regular fa-user"></i>
              Thông tin liên hệ
            </div>

            <div className="form-group">
              <label>Họ tên người đại diện</label>

              <input
                type="text"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="row">

              <div className="form-group">
                <label>Số điện thoại liên hệ</label>

                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-group">
                <label>Email liên hệ</label>

                <input
                  type="email"
                  placeholder="Nhập email"
                />
              </div>

            </div>

            <div className="form-group">
              <label>Mật khẩu</label>

              <input
                type="password"
                placeholder="Tạo mật khẩu an toàn"
              />
            </div>
          </div>

          {/* CHECKBOX */}
          <div className="checkbox">

            <input
              type="checkbox"
              id="agree"
            />

            <label htmlFor="agree">
              Tôi đã đọc và đồng ý với các{' '}
              <a href="#">Điều khoản sử dụng</a>
              {' '}và{' '}
              <a href="#">Chính sách bảo mật</a>
              {' '}của Chợ Tới Cửa.
            </label>

          </div>

          {/* BUTTON */}
          <button className="submit-btn">
            Đăng ký Đối tác →
          </button>

          <p className="login-link">
            Đã có tài khoản?
            {' '}
            <a href="#">Đăng nhập ngay</a>
          </p>

          <footer>
            © 2024 Chợ Tới Cửa. Nền tảng kết nối nông sản sạch.
          </footer>

        </div>

      </div>

    </div>
  )
}

export default RegisterStore