import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ConcertList.module.css";
import { useQuery } from "@tanstack/react-query";
import { $_concert } from "util/axios";

export default function ConcertList() {
  const navigate = useNavigate();
  const bottomObserver = useRef(null);
  let nowTime = new Date();

  const [page, setPage] = useState(1);
  const [bottom, setBottom] = useState(null);
  const [list, setList] = useState([]);

  const { isLoading, data, refetch } = useQuery(["concert"], () =>
    $_concert.get(`/concert?page=${page}`)
  );

  const onSelect = (id) => {
    navigate(`detail/${id}`, {
      state: {
        concertId: id,
      },
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(page + 1);
          refetch();
        }
      },
      { threshold: 0.25, rootMargin: "80px" }
    );
    bottomObserver.current = observer;
  }, []);

  useEffect(() => {
    const observer = bottomObserver.current;
    if (bottom) {
      observer.observe(bottom);
    }
    return () => {
      if (bottom) {
        observer.unobserve(bottom);
      }
    };
  }, [bottom]);

  useEffect(() => {
    if (!isLoading) setList((list) => [...list, data.data]);
  }, [isLoading]);

  return (
    <div className={style.total}>
      <div className={style.header}>공연 목록</div>
      <div className={style.descript}>
        원하시는 공연을 선택하고 좌석을 예매해보세요. 모든 좌석이 매진되기 전에
        서두르세요! <br />
        결제는 CAN YOU GET IT 포인트 또는 카카오 페이를 통해 이루어집니다.
      </div>
      <div className={style.container}>
        {!isLoading &&
          data &&
          data.data.map((content) => {
            let date =
              content.endDate.slice(0, 4) +
              "/" +
              content.endDate.slice(5, 7) +
              "/" +
              content.endDate.slice(8, 10) +
              " " +
              content.endDate.slice(11, 13) +
              "시" +
              content.endDate.slice(14, 16) +
              "분";
            return (
              <div
                key={content.concertId}
                className={
                  content.rest === 0 || nowTime >= new Date(content.endDate)
                    ? style.card_disable
                    : style.card
                }
                onClick={() => {
                  if (content.rest !== 0 && nowTime < new Date(content.endDate))
                    onSelect(content.concertId);
                }}
              >
                <div className={style.poster_url}>
                  <img src={content.image} alt="" />
                </div>
                <div className={style.content_title}>{content.title}</div>
                <div className={style.contents}>
                  <div className={style.name}>
                    <div className={style.title}>잔여좌석</div>
                    <div className={style.content}>
                      {content.rest === 0
                        ? "마감"
                        : content.rest + "/" + content.all}
                    </div>
                  </div>
                  <div className={style.seat}>
                    <div className={style.title}>예매마감일</div>
                    <div className={style.content}>
                      {nowTime >= new Date(content.endDate) ? "마감" : date}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div ref={setBottom}></div>
    </div>
  );
}
