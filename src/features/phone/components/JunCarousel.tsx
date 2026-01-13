"use client"

import React, { useState, useCallback } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

// SVG 아이콘
const ArrowLeftSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24px" height="24px">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const ArrowRightSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24px" height="24px">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

interface Props {
  urls: string[]
}

export default function JunCarousel({ urls = [] }: Props) {
  const t = useTranslations()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false)
  const [prevUrls, setPrevUrls] = useState(urls)

  // URL이 변경되면 인덱스 초기화 (렌더링 중 상태 업데이트)
  if (urls !== prevUrls) {
    setCurrentIndex(0)
    setPrevUrls(urls)
  }

  const goToNext = useCallback(() => {
    if (currentIndex < urls.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, urls.length])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
    setIsDragging(true)
    setIsHorizontalScroll(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return

    const deltaX = e.touches[0].clientX - touchStartX
    const deltaY = e.touches[0].clientY - touchStartY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setIsHorizontalScroll(true)
      setDragOffset(deltaX)
    }
  }

  const handleTouchEnd = () => {
    if (isHorizontalScroll) {
      if (dragOffset > 50 && currentIndex > 0) {
        goToPrev()
      } else if (dragOffset < -50 && currentIndex < urls.length - 1) {
        goToNext()
      }
    }
    setTouchStartX(null)
    setTouchStartY(null)
    setDragOffset(0)
    setIsDragging(false)
  }

  if (urls.length === 0) {
    return <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-gray-400">{t('Phone.Carousel.no_image')}</div>
  }

  return (
    <div
      className="relative w-full h-[300px] overflow-hidden flex justify-center items-center touch-pan-y select-none bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 왼쪽 버튼 */}
      <button
        className={`absolute z-10 top-1/2 -translate-y-1/2 left-[10px] w-10 h-10 bg-black/50 text-white rounded-full flex justify-center items-center transition-opacity duration-200 ${currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}`}
        onClick={goToPrev}
        disabled={currentIndex === 0}
      >
        <ArrowLeftSVG />
      </button>

      {/* 슬라이드 뷰포트 */}
      <div
        className="flex h-full w-full"
        style={{
          transition: !isDragging ? "transform 0.3s ease-in-out" : "none",
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
        }}
      >
        {urls.map((url, index) => (
          <div key={index} className="flex-none w-full h-full flex justify-center items-center relative p-4">
            {/* Next.js Image 사용 */}
            <Image
              src={url}
              alt={`Slide ${index}`}
              fill
              className="object-contain select-none pointer-events-none p-4"
              draggable={false} // 이미지 드래그 방지
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        ))}
      </div>

      {/* 오른쪽 버튼 */}
      <button
        className={`absolute z-10 top-1/2 -translate-y-1/2 right-[10px] w-10 h-10 bg-black/50 text-white rounded-full flex justify-center items-center transition-opacity duration-200 ${currentIndex === urls.length - 1 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}`}
        onClick={goToNext}
        disabled={currentIndex === urls.length - 1}
      >
        <ArrowRightSVG />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {urls.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${currentIndex === index ? 'bg-[#0066FF]' : 'bg-black/20'}`}
          />
        ))}
      </div>
    </div>
  )
}