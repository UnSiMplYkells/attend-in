import styled from 'styled-components';

const LoaderOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(148, 163, 184, 0.2); 
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loader = styled.div`
  width: 40px;
  aspect-ratio: 1;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db; /* Customize the spinner color */
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function Spinner() {
  return (
    <LoaderOverlay>
      <Loader />
    </LoaderOverlay>
  );
}
