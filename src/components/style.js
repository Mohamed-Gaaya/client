import styled from "styled-components";

export const StyledWrapper = styled.div`
  .btn {
    width: full;
    height: full;
    border-radius: 5px;
    border: none;
    transition: all 0.5s ease-in-out;
    font-size: 20px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 600;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    color: #040f16;
  }

  .btn:hover {
    box-shadow: 0 0 20px 0px #2e2e2e3a;
  }

  .btn .icon {
    position: absolute;
    height: 40px;
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s;
  }

  .btn .text {
    transform: translateX(55px);
  }

  .btn:hover .icon {
    width: 175px;
  }

  .btn:hover .text {
    transition: all 0.5s;
    opacity: 0;
  }

  .btn:focus {
    outline: none;
  }

  .btn:active .icon {
    transform: scale(0.85);
  }
`;
export const StyledCardWrapper = styled.div`
  .card {
    width: 280px;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 0px 14px -2px #bebebe;
    transition: 0.2s ease-in-out;
  }

  .card:hover {
    cursor: pointer;
  }

  .img {
    width: 100%;
    height: 7em;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: linear-gradient(#7980c5, #9198e5);
    display: flex;
    align-items: top;
    justify-content: right;
  }

  .save {
    transition: 0.2s ease-in-out;
    border-radius: 10px;
    margin: 20px;
    width: 30px;
    height: 30px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .save .svg {
    transition: 0.2s ease-in-out;
    width: 15px;
    height: 15px;
  }

  .save:hover .svg {
    fill: #ced8de;
  }

  .text {
    padding: 7px 20px;
    display: flex;
    flex-direction: column;
    align-items: space-around;
  }

  .text .h3 {
    font-family: system-ui;
    font-size: medium;
    font-weight: 600;
    color: black;
    text-align: center;
  }

  .text .p {
    font-family: system-ui;
    color: #999999;
    font-size: 13px;
    margin: 0px;
    text-align: center;
    padding: 5px;
  }

  .icon-box {
    margin: 10px;
    padding: 12px;
    background-color: #7980c5;
    border-radius: 10px;
    text-align: center;
  }

  .icon-box .span {
    font-family: system-ui;
    font-size: small;
    font-weight: 500;
    color: #fff;
  } /*# sourceMappingURL=index.css.map */
`;

export const StyledCardBestSellerWrapper = styled.div`
  .card {
    width: 245px;
    height: 310px;
    border-radius: 20px;
    background: #f5f5f5;
    position: relative;
    padding: 1.8rem;
    border: 2px solid #c3c6ce;
    transition: 0.5s ease-out;
    overflow: visible;
  }

  .card-details {
    color: black;
    height: 100%;
    gap: 0.5em;
    display: grid;
    place-content: center;
  }

  .card-button {
    transform: translate(-50%, 125%);
    width: 60%;
    border-radius: 1rem;
    border: none;
    background-color: #008bf8;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    position: absolute;
    left: 50%;
    bottom: 0;
    opacity: 0;
    transition: 0.3s ease-out;
  }

  .text-body {
    color: rgb(134, 134, 134);
  }

  /*Text*/
  .text-title {
    font-size: 1.5em;
    font-weight: bold;
  }

  /*Hover*/
  .card:hover {
    border-color: #008bf8;
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }

  .card:hover .card-button {
    transform: translate(-50%, 50%);
    opacity: 1;
  }
`;
