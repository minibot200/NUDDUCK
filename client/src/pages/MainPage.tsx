/**
 * File Name    : MainPage.tsx
 * Description  : 메인페이지
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     메인페이지 생성
 * 2024.09.17    황솜귤      Modified    Intersection Observer(React)로 텍스트 애니메이션 효과 추가
 * 2024.09.19    황솜귤      Modified    전체 섹션 레이아웃 배치
 * 2024.09.19    황솜귤      Modified    TailwindCSS 변환
 */

import { useEffect, useRef } from 'react';
import './MainPage.css'; // CSS 파일 유지 가능 (일부 스타일링 적용)

/**
 * MainPage Component
 * - IntersectionObserver를 사용해 텍스트 애니메이션 효과 적용
 * - TailwindCSS를 사용해 스타일 적용
 */
const MainPage = () => {
  const textRef = useRef<HTMLParagraphElement>(null); // 텍스트를 참조할 useRef 생성

  // Intersection Observer 사용 (옵션 제거)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        } else {
          entry.target.classList.remove('fade-in');
        }
      });
    });

    if (textRef.current) {
      observer.observe(textRef.current); // 텍스트 요소 관찰 시작
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current); // 컴포넌트 언마운트 시 관찰 해제
      }
    };
  }, []);

  // 화살표 클릭 시 부드러운 스크롤 이동
  const handleArrowClick = () => {
    window.scrollTo({
      top: window.scrollY + 800, // 현재 위치에서 800px 밑으로 스크롤
      behavior: 'smooth', // 스크롤이 부드럽게 이동
    });
  };

  return (
    <div className="main-container m-0 w-full p-0">
      {/* 상단 배너 */}
      <div className="banner flex h-[900px] w-full flex-col items-center justify-center bg-gradient-to-b from-[#979e07] to-white px-5 py-20 text-center text-gray-800">
        <div className="banner-content">
          <h1 className="banner-title mb-2 text-3xl font-extrabold">
            <span className="extrabold">누워서</span>
            <span className="extrabold text-white"> 떡 </span>
            <span className="extrabold">먹기</span>
            <span className="semibold text-gray-800">처럼 쉬운 면접 준비!</span>
          </h1>
          <h2 className="text-xl font-semibold">“누떡”이 도와줄게~</h2>
          <img
            src="/main-page-arrow.png"
            alt="Arrow Down"
            className="arrow-down ml-[120px] mt-[400px] h-[142px] w-[166px] opacity-50"
            onClick={handleArrowClick} // 클릭 이벤트 핸들러 추가
          />
        </div>
      </div>

      {/* CTA 섹션 */}
      {/* 네비바가 자동으로 따라오기 위해 fixed bottom-0 left-0 z-50 등 사용하여 고정함(스크롤 시 고정가능)*/}
      <div className="cta-container fixed bottom-0 left-0 z-50 mt-12 w-full pb-5 text-center">
        <div className="flex-container flex items-center justify-center gap-x-[800px]">
          <p className="text-lg font-semibold">
            AI 코치 <strong>누떡</strong>과 함께 면접 준비를 시작해 보세요!
          </p>
          <a
            href="#"
            className="cta-button ml-2 inline-block rounded bg-[#909700] px-5 py-2 text-base text-white"
          >
            면접 준비 바로가기
          </a>
        </div>
      </div>
      {/* 텍스트 설명 */}
      <h2 className="my-8 mt-36 text-center text-xl font-bold">나의 인생을 그래프로 요약하고,</h2>
      {/* 이미지로 대체되는 그래프 섹션 */}
      <section className="image-section px-[200px]">
        <img
          src="graph-sample.png"
          alt="life-graph"
          className="full-width-image mb-[200px] mt-[200px]"
        />
      </section>
      {/* AI 소개 섹션 */}
      <section className="ai-section relative mt-12 inline-block">
        <img src="ai-solution.png" alt="ai-solution" className="block w-full" />
        <p
          ref={textRef}
          className="fade-in absolute left-[50%] top-[20%] -translate-x-1/2 -translate-y-1/2 transform text-center text-2xl font-normal text-black transition-opacity duration-1000 ease-out"
        >
          <strong className="highlight font-semibold">인공지능</strong>으로부터 해답을 찾아 보세요
        </p>
      </section>
      {/* 상담 봇 섹션 */}
      <section className="chatbot-section flex items-center justify-center py-12">
        <div className="chatbot-placeholder relative inline-block w-full text-center">
          <img
            src="ai-simulation.png"
            alt="ai-simulation"
            className="chatbot-image h-auto w-full"
          />
          <p className="chatbot-text absolute bottom-[630px] left-1/2 -translate-x-1/2 transform text-lg font-medium text-gray-800">
            <strong>누떡</strong>에서는 희망 직군의 가상 면접을 지원합니다
          </p>
        </div>
      </section>
      {/* 하단 설명 섹션 */}
      <section className="qna-section my-6">
        <div className="qna-item mx-auto flex max-w-[1000px] items-start justify-between">
          <h2 className="qna-question w-[45%] text-left text-xl font-bold">
            <strong>Q.</strong> 취업 준비를 쉽고 재미있게 할 수 있을까?
          </h2>
          <p className="qna-answer w-[55%] text-right text-lg text-gray-700">
            <strong>A.</strong> 당연하죠!{' '}
            <span className="highlight font-bold text-[#909700]">누떡</span>에서는 취업 준비를
            누워서 떡 먹듯 할 수 있습니다!
          </p>
        </div>
      </section>
      {/* FAQ 섹션 */}
      <section className="faq-section bg-[#FFFFFF] px-[10%] py-[200px] text-center">
        <div className="faq-grid grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 첫 번째 박스: AI 면접 컨설팅 */}
          <div className="faq-item transform rounded-xl bg-[#ECEBD4] p-10 text-center shadow-md transition-transform duration-300 hover:-translate-y-2">
            <img
              src="/box-icon-1.png"
              alt="AI 면접 컨설팅 아이콘"
              className="box-icon mx-auto mb-6 h-24 w-24"
            />
            <h4 className="mb-4 text-[28px] font-bold">AI 면접 컨설팅</h4>
            <ul className="mx-4 list-none p-0 text-left text-[20px]">
              <li className="mb-3 text-gray-700">1. 온라인으로 언제 어디서나</li>
              <li className="mb-3 text-gray-700">2. AI를 통한 실전과 유사한 면접 프로세스</li>
              <li className="mb-3 text-gray-700">3. 가상 면접 종료 후 즉각적 피드백</li>
            </ul>
          </div>

          {/* 두 번째 박스: 커뮤니티 공간 */}
          <div className="faq-item transform rounded-xl bg-[#ECEBD4] p-10 text-center shadow-md transition-transform duration-300 hover:-translate-y-2">
            <img
              src="/box-icon-2.png"
              alt="커뮤니티 공간 아이콘"
              className="box-icon mx-auto mb-6 h-24 w-24"
            />
            <h4 className="mb-4 text-[28px] font-bold">커뮤니티 공간</h4>
            <ul className="mx-4 list-none p-0 text-left text-[20px]">
              <li className="mb-3 text-gray-700">1. 게시판을 활용한 글쓰기</li>
              <li className="mb-3 text-gray-700">2. 원하는 주제로 적합한 상대와 온라인 미팅</li>
              <li className="mb-3 text-gray-700">3. 유저들과 활발한 정보 공유</li>
            </ul>
          </div>

          {/* 세 번째 박스: 인생 그래프 */}
          <div className="faq-item transform rounded-xl bg-[#ECEBD4] p-10 text-center shadow-md transition-transform duration-300 hover:-translate-y-2">
            <img
              src="/box-icon-3.png"
              alt="인생 그래프 아이콘"
              className="box-icon mx-auto mb-6 h-24 w-24"
            />
            <h4 className="mb-4 text-[28px] font-bold">인생 그래프</h4>
            <ul className="mx-4 list-none p-0 text-left text-[20px]">
              <li className="mb-3 text-gray-700">1. 유저 정보 기반의 그래프 작성</li>
              <li className="mb-3 text-gray-700">2. 일대기를 그래프로 표시</li>
              <li className="mb-3 text-gray-700">3. 향후 방향성 및 목표 설계</li>
            </ul>
          </div>
        </div>
      </section>
      {/* CTA 섹션
      <div className="cta-container mt-12 pb-5 text-center">
        <div className="flex-container flex items-center justify-center gap-x-[800px]">
          <p className="text-lg font-semibold">
            AI 코치 <strong>누떡</strong>과 함께 면접 준비를 시작해 보세요!
          </p>
          <a
            // href="#"
            className="cta-button mb-2 ml-2 inline-block rounded bg-[#909700] px-5 py-2 text-base text-white"
          >
            면접 준비 바로가기
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default MainPage;