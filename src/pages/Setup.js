import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Setup.css";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateEmail, updateProfile } from "firebase/auth";
import { db, auth, storage } from "../firebaseConfig";

function Setup() {
  const navigator = useNavigate();
  const { userId } = useParams();
  const avatarInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImageURL, setPreviewImageURL] = useState(null);
  const [name, setName] = useState("");
  const [showCheckBox, setShowCheckBox] = useState(false);
  if (auth.currentUser?.uid !== userId) {
    navigator("/home");
  }
  useEffect(() => {
    const getPageOwner = async () => {
      const docSnap = await getDoc(doc(db, `users/${userId}`));
      setPreviewImageURL(docSnap.data().photoURL);
      setName(docSnap.data().name);
    };
    getPageOwner();
  }, []);
  const uploadAvatar = () => {
    avatarInput.current.click();
  };
  const changeAvatar = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  useEffect(() => {
    if (selectedImage) {
      setPreviewImageURL(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);
  const onSubmit = async () => {
    const imageRef = ref(storage, `userimages/${auth.currentUser.uid}`);
    if (selectedImage) {
      uploadBytes(imageRef, selectedImage).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updateDoc(doc(db, `users/${userId}`), {
            name,
            photoURL: url,
          });
          updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: url,
          });
        });
      });
    } else {
      updateDoc(doc(db, `users/${userId}`), {
        name,
        photoURL: previewImageURL,
      });
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: previewImageURL,
      });
    }
    setShowCheckBox(true);
  };
  const toggleCheckbox = () => {
    setShowCheckBox(false);
  }
  return (
    <div className="Setup-box">
      <div className="Setup-background">
        <div className="Setup-member-container">
          {showCheckBox ? (
            <div className="Setup-showCheckBox-background">
              <div className="Setup-showCheckBox-container">
                <div className="Setup-showCheckBox-image-container">
                  <img className="Setup-showCheckBox-image" src="https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-max-1mb.gif" alt="finished" />
                </div>
                <div>更新完成</div>
                <div onClick={toggleCheckbox} className="Setup-showCheckBox-button">確認</div>
              </div>
            </div>
          ) : null}
          <div className="Setup-member-title">會員資料</div>
          <div className="Setup-member-avatar-container">
            <div className="Setup-member-avatar-image-container">
              <img className="Setup-member-avatar" src={previewImageURL} alt="avatar" />
              <div className="Setup-member-avatar-change-icon-container" onClick={uploadAvatar}>
                <img className="Setup-member-avatar-change-icon" src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png" alt="avatar-button" />
              </div>
              <input accept="image/*" type="file" ref={avatarInput} onChange={changeAvatar} style={{ display: "none" }} />
            </div>
          </div>
          <div className="Setup-personal-information-container">
            <div className="word-gray">姓名</div>
            <div className="Setup-name-input-container">
              <input className="Setup-name-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button className="Setup-personal-information-button" type="button" onClick={onSubmit}>更新資料</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Setup;
