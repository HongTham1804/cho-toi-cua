import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentUser, getStoredAuthUser, updateCurrentUserProfile } from '../../services/authApi';
import './account-settings.css';

const EMPTY_FORM = {
  name: '',
  phone: '',
};

export default function AccountSettings() {
  const [user, setUser] = useState(() => getStoredAuthUser());
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingField, setEditingField] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchCurrentUser()
      .then((currentUser) => {
        if (!isMounted) return;
        setUser(currentUser);
        setFormData({
          name: currentUser?.name || '',
          phone: currentUser?.phone || '',
        });
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        const storedUser = getStoredAuthUser();
        setUser(storedUser);
        setFormData({
          name: storedUser?.name || '',
          phone: storedUser?.phone || '',
        });
        setError(storedUser ? '' : 'Vui lòng đăng nhập lại để xem thông tin tài khoản.');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const startEditing = (field) => {
    setEditingField(field);
    setNotice('');
    setError('');
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
  };

  const cancelEditing = () => {
    setEditingField('');
    setError('');
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value,
    }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const updatedUser = await updateCurrentUserProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      setUser(updatedUser);
      setFormData({
        name: updatedUser?.name || '',
        phone: updatedUser?.phone || '',
      });
      setEditingField('');
      setNotice('Cập nhật tài khoản thành công.');
    } catch (updateError) {
      setError(updateError.message || 'Không thể cập nhật tài khoản.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditableValue = (field, label) => {
    const isEditing = editingField === field;
    const value = field === 'name' ? user?.name : user?.phone;

    return (
      <div className="settings-row-core">
        <div className="info-group-core">
          <label>{label}</label>
          {isEditing ? (
            <input
              className="settings-input-core"
              type="text"
              inputMode={field === 'phone' ? 'numeric' : 'text'}
              maxLength={field === 'phone' ? 10 : undefined}
              value={formData[field]}
              onChange={(event) => handleInputChange(field, event.target.value)}
              autoFocus
            />
          ) : (
            <p>{value || 'Chưa cập nhật'}</p>
          )}
        </div>

        {isEditing ? (
          <div className="settings-action-group-core">
            <button className="save-link-core" type="button" onClick={saveProfile} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button className="cancel-link-core" type="button" onClick={cancelEditing} disabled={isSaving}>
              Hủy
            </button>
          </div>
        ) : (
          <button className="edit-link-core" type="button" onClick={() => startEditing(field)}>
            Thay đổi
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="settings-page-core">
      <div className="settings-container-core">
        <div className="settings-header-core">
          <Link to="/logged-in-homepage" className="back-btn-core">
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>
          <h1 className="settings-title-core">Cài đặt tài khoản</h1>
        </div>

        <div className="settings-layout-core">
          <main className="settings-main-content-core">
            {isLoading && <p className="settings-message-core">Đang tải thông tin tài khoản...</p>}
            {notice && <p className="settings-message-core settings-message-core--success">{notice}</p>}
            {error && <p className="settings-message-core settings-message-core--error">{error}</p>}

            <section className="settings-card-core">
              <h3>Thông tin tài khoản</h3>
              <div className="settings-row-core">
                <div className="info-group-core">
                  <label>Địa chỉ Email</label>
                  <p>{user?.email || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </section>

            <section className="settings-card-core">
              <h3>Thông tin cá nhân</h3>
              {renderEditableValue('name', 'Họ và tên')}
              {renderEditableValue('phone', 'Số điện thoại')}
            </section>

            <section className="settings-card-core">
              <h3>Cài đặt thông báo</h3>
              <div className="settings-row-core">
                <div className="info-group-core">
                  <label>Thông báo qua Email</label>
                  <p>Nhận cập nhật về đơn hàng và khuyến mãi</p>
                </div>
                <label className="switch-core">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-core"></span>
                </label>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
