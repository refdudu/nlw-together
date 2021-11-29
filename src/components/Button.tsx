import React from "react";
import { ButtonHTMLAttributes } from "react";

import "../styles/css/button.css";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;


function Button(props: ButtonProps) {
  return <button className="button" {...props} />;
}

export default Button;
