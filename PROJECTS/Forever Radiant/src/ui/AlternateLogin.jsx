import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { useLoginWithOAuth } from "../Features/Authentication/useLoginWithOAuth";

const StyledAlternateLogin = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 20px 0 50px 0;
  gap: 5px;
`

const Li = styled.li`
  padding: 10px;
  border: solid 1px;
  transition: transform .15s ease-in-out;
  cursor: pointer;
  /* cursor: not-allowed; */

  display: flex;
  gap: 20px;
  align-items: center;


  &:hover{
    transform: scale(1.02);
  }

  & svg{
    width: 25px;
    height: 25px;
  }

  span{
    color: #1877F2;
  }
`
  
  export default function AlternateLogin({type}) {
  const { loginWithOAuthMutation: loginWithOAuth } = useLoginWithOAuth();

  return (
    <StyledAlternateLogin>
      <Li onClick={() => loginWithOAuth()}><FcGoogle />{type === "signup" ? "Sign up" : "Continue"} with Google</Li>
      <Li><FaApple />{type === "signup" ? "Sign up" : "Continue"} with Apple (soon...)</Li>
      <Li><span><FaFacebookSquare /></span>{type === "signup" ? "Sign up" : "Continue"} with Facebook (soon...)</Li>
    </StyledAlternateLogin>
  )
};