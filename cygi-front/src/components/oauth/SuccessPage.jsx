import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터에서 pg_token 값을 추출합니다.
    const searchParams = new URLSearchParams(location.search);
    const pg_token = searchParams.get("pg_token");

    // localStorage에서 tid 값을 가져옵니다.
    const tid = localStorage.getItem("tid");

    // 결제 승인 API를 호출합니다.
    const data = {
      cid: "TC0ONETIME",
      tid: tid,
      partner_order_id: "1001",
      partner_user_id: "user01",
      pg_token: pg_token,
    };

    // 로그인한 사용자의 고유 식별자를 전달합니다.
    const userId = 1; // 예시로 임의의 값을 사용합니다.

    // 결제 승인 API를 호출합니다.
    axios
      .post(`http://localhost:8001/api/v1/reservation/approve/${userId}`, data)
      .then((response) => {
        if (response.status === 200) {
          // 결제 승인 성공 처리
          alert("결제가 완료되었습니다!");
          navigate("../home");
        } else {
          // 결제 승인 실패 처리
          alert("결제를 실패하였습니다.");
        }
      })
      .catch((error) => {
        alert("문제가 발생하였습니다.");
        console.log(error);
      });
  }, [location.search]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <h3>결제 승인 처리 중입니다...</h3>
      {/* 결제 성공 페이지에 필요한 컴포넌트들을 추가합니다. */}
    </div>
  );
}

export default SuccessPage;
