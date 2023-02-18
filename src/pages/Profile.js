import React, { useState, useEffect, useRef } from "react";

import "../Styles/Setup.css";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useSelector } from "react-redux";
import { db, auth, storage } from "../firebaseConfig";
import Loading from "../components/UI/Loading";
import Modal from "../components/UI/Modal";
import useHttp from "../hooks/use-http";
import { getDocumentData } from "../lib/api";

function Profile() {
  const currentUser = useSelector((state) => state.user.user);
  const avatarRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    sendRequest,
    setData,
    isLoading,
    data: pageOwner,
    error,
  } = useHttp(getDocumentData, true);

  useEffect(() => {
    if (currentUser) {
      sendRequest(`users/${currentUser.uid}`);
    }
  }, [sendRequest, currentUser]);

  useEffect(() => {
    if (selectedImage) {
      setData({ ...pageOwner, photoURL: URL.createObjectURL(selectedImage) });
    }
  }, [selectedImage]);

  const clickAvatarInput = () => {
    avatarRef.current.click();
  };

  const uploadAvatar = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      if (selectedImage) {
        const imageRef = ref(storage, `userimages/${currentUser.uid}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        const url = await getDownloadURL(snapshot.ref);
        await updateDoc(doc(db, `users/${currentUser.uid}`), {
          name: pageOwner.name,
          photoURL: url,
        });
        await updateProfile(auth.currentUser, {
          displayName: pageOwner.name,
          photoURL: url,
        });
      } else {
        await updateDoc(doc(db, `users/${currentUser.uid}`), {
          name: pageOwner.name,
          photoURL: pageOwner.photoURL,
        });
        await updateProfile(auth.currentUser, {
          displayName: pageOwner.name,
          photoURL: pageOwner.photoURL,
        });
      }
      setShowCheckBox({ message: "更新成功" });
    } catch (err) {
      setShowCheckBox({ message: "更新失敗" });
    }
    setSubmitting(false);
  };

  const closeCheckbox = () => {
    setShowCheckBox(null);
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {showCheckBox ? (
        <Modal onConfirm={closeCheckbox} message={showCheckBox.message} />
      ) : null}
      <div className="Setup-box">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="Setup-background">
            <div className="Setup-member-container">
              <div className="Setup-member-title">會員資料</div>
              <div className="Setup-member-avatar-container">
                <div className="Setup-member-avatar-image-container">
                  <img
                    className="Setup-member-avatar"
                    src={pageOwner?.photoURL}
                    alt="avatar"
                  />
                  <div
                    className="Setup-member-avatar-change-icon-container"
                    onClick={clickAvatarInput}
                  >
                    <img
                      className="Setup-member-avatar-change-icon"
                      src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png"
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
              <div className="Setup-personal-information-container">
                <div className="word-gray">姓名</div>
                <div className="Setup-name-input-container">
                  <input
                    className="Setup-name-input"
                    type="text"
                    value={pageOwner?.name || ""}
                    onChange={(e) => setData({ ...pageOwner, name: e.target.value })}
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
        )}
      </div>
    </>
  );
}
export default Profile;
