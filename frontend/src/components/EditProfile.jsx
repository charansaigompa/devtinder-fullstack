import React, { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");

  const saveProfile = async () => {
    setError("");
    setLoading(true);
    try {
      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      if (skillsArray.length === 1 && skills.includes(" ")) {
        setError("Invalid skills data. Example: Python, Java, C++, HTML");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("about", about);
      formData.append("skills", JSON.stringify(skillsArray));
      if (backendImage) {
        formData.append("photoUrl", backendImage);
      }
      const result = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });
      dispatch(addUser(result?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/");
      }, 1000);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data || "something went wrong");
      console.error(err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center my-5 md:my-10 gap-5">
        <div className="flex justify-center mx-10">
          <div className="card card-border bg-base-300 w-96 ">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    className="input"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    placeholder=""
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    className="input"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    placeholder=""
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Photo</legend>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={handleImage}
                    placeholder="Upload Profile image"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Age</legend>
                  <input
                    type="text"
                    className="input"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                    placeholder=""
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender</legend>
                  <select
                    name=""
                    id=""
                    className="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="others">others</option>
                  </select>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">About</legend>
                  <input
                    type="text"
                    className="input"
                    value={about}
                    onChange={(e) => {
                      setAbout(e.target.value);
                    }}
                    placeholder=""
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Skills</legend>
                  <input
                    type="text"
                    className="input"
                    value={skills}
                    onChange={(e) => {
                      setSkills(e.target.value);
                    }}
                    placeholder="skill 1,skill 2,.."
                  />
                </fieldset>
              </div>
              <p className="text-red-500">{error}</p>
              <div className="card-actions justify-center">
                <button
                  disabled={loading}
                  className="btn btn-primary"
                  onClick={saveProfile}
                >
                  {loading ? <ClipLoader size={20} color="white" /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
