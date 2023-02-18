import React from "react";
import Loginbox from "../components/Login/Loginbox";

function Login() {
  return (
    <div className="box">
      <div className="signin-up-background">
        <div className="content-container">
          <div className="word-container">
            <div className="title">Record the time, enjoy the life.</div>
            <div className="text">
              When tomorrow turns in today, yesterday,
              and someday that no more important in your memory,
              we suddenly realize that we are pushed forward by time.
              This is not a train in still in which you may feel forward when another train goes by.
              It is the truth that we’ve all grown up. And we become different.
            </div>
          </div>
          <Loginbox />
        </div>
      </div>
    </div>
  );
}
export default Login;
