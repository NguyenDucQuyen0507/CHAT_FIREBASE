import styled from "styled-components";
const StyledContainer = styled.div`
  flex-grow: 1;
`;
interface StyledBackgroundProps {
  src: string;
}
const StyledBackground = styled.img<StyledBackgroundProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const SpaceMess = () => {
  const background = "/background.jpg";
  return (
    <StyledContainer>
      <StyledBackground src={background} />
    </StyledContainer>
  );
};

export default SpaceMess;
