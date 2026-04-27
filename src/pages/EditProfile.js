import React, { useState, useEffect, useRef } from "react";

import "../Styles/Setup.css";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import { db, storage } from "../firebaseConfig";
import Loading from "../components/UI/Loading";
import Modal from "../components/UI/Modal";
import editIcon from "../assets/icons/edit.png";

function EditProfile() {
  const { auth: authUser, profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const avatarRef = useRef();
  const [form, setForm] = useState({
    name: "",
    photoURL: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [modalState, setModalState] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 初始化表單
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        photoURL: profile.photoURL || "",
      });
    }
  }, [profile]);

  // 預覽圖片
  useEffect(() => {
    let cleanup;

    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewURL(url);

      cleanup = () => URL.revokeObjectURL(url);
    }

    return cleanup;
  }, [selectedImage]);

  const clickAvatarInput = () => {
    avatarRef.current.click();
  };

  const uploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
  };

  const onSubmit = async () => {
    if (!authUser?.uid) return;
    setSubmitting(true);

    try {
      let { photoURL } = form;

      if (selectedImage) {
        const imageRef = ref(storage, `userimages/${authUser.uid}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // 更新 Firestore
      await updateDoc(doc(db, `users/${authUser.uid}`), {
        name: form.name,
        photoURL,
      });

      // 更新 Redux（讓 UI 即時同步）
      dispatch(userActions.setProfile({
        ...profile,
        name: form.name,
        photoURL,
      }));

      setModalState({ message: "更新成功", type: "success" });
    } catch (err) {
      setModalState({ message: "更新失敗", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const closeCheckbox = () => {
    setModalState(null);
  };

  if (!profile) return <Loading />;

  return (
    <>
      {modalState && (
        <Modal
          onConfirm={closeCheckbox}
          message={modalState.message}
          type={modalState.type}
        />
      )}
      <div className="Setup-box">
        <div className="Setup-background">
          <div className="Setup-member-container">
            <div className="Setup-member-title">會員資料</div>

            {/* Avatar */}
            <div className="Setup-member-avatar-container">
              <div className="Setup-member-avatar-image-container">
                <img
                  className="Setup-member-avatar"
                  src={previewURL || form.photoURL}
                  alt="avatar"
                />
                <div
                  className="Setup-member-avatar-change-icon-container"
                  onClick={clickAvatarInput}
                >
                  <img
                    className="Setup-member-avatar-change-icon"
                    src={editIcon}
                    alt="avatar-button"
                  />
                </div>
                <input
                  accept="image/*"
                  type="file"
                  ref={avatarRef}
                  onChange={uploadAvatar}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Name */}
            <div className="Setup-personal-information-container">
              <div className="word-gray">姓名</div>
              <div className="Setup-name-input-container">
                <input
                  className="Setup-name-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))}
                />
              </div>
              <button
                className="Setup-personal-information-button"
                type="button"
                onClick={onSubmit}
                disabled={submitting}
              >
                {submitting ? "提交中..." : "更新資料"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditProfile;
