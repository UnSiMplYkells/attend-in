import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import styled from "styled-components";
import Button from "../../ui/Button"
import CustomInput from "../../ui/CustomInput";
import AlternateLogin from "../../ui/AlternateLogin";
import MiniLoader from "../../ui/MiniLoader";

const Container = styled.div`
  max-width: 60%;
  margin: auto;

  @media (max-width: 620px) {
    max-width: 80%;
  }
`
const Header = styled.p`
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  padding-top: 30px;

  @media (max-width: 820px){
    font-size: 1.5em; 
  }

  @media (min-width: 820px){
    font-size: 2em; 
  }
`;
const StyledButton = styled(Button)`
  width: 100%;
  margin: 30px 0;
  padding: 13px 0; 

  &:disabled {
    background-color: rgba(59, 59, 59, 0.8);
    opacity: 1;
  }
`
export default function LoginForm() {
  const { register, handleSubmit, reset } = useForm()
  const { login, isLoading } = useLogin()

  function onSubmitForm(data){
    const { email, password } = data;
    if(!email || !password) return
    login(
      { email, password }, 
      {
        onSettled: () => {
          reset()
        }
      }
    )
  }
  return (
    <Container>
      <Header>Welcome back!</Header>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <CustomInput 
          type="text" 
          id="email"
          {...register("email")} 
          disabled={isLoading}
        >
          Email address*
        </CustomInput>

        <CustomInput 
          type="password" 
          id="password"
          {...register("password")} 
          disabled={isLoading}
        >
          Password*
        </CustomInput>

        <StyledButton 
          size="large" 
          variation="cart" 
          disabled={isLoading}
        >
          {isLoading ? <MiniLoader /> : "CONTINUE"}
        </StyledButton>
      </form>
      <hr />
      <AlternateLogin type="login"/>
    </Container>
  )
};
