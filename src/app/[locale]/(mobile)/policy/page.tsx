export default function PolicyPage() {
    return (
        <div className="max-w-[800px] mx-auto py-12 px-5 font-sans whitespace-pre-line leading-relaxed text-[#333]">
            <h1 className="text-2xl font-bold mb-8 border-b pb-4">회사소개 및 이용약관</h1>

            <div className="space-y-6 text-sm">
                <section>
                    <h2 className="text-lg font-bold mb-2">KT 공식 인증 온라인 파트너 플랫폼, KT마켓</h2>
                    <p>
                        KT마켓은 (주)준텔레콤이 운영하는 KT 공식 인증 온라인 유통 파트너입니다.
                    </p>
                    <p>
                        2012년 설립된 (주)준텔레콤은 약 14년간 KT 단일 브랜드 유통에만 집중해 온 전문성과 신뢰를 갖춘 1등 통신 전문 기업입니다.
                    </p>
                    <p>
                        현재 직영 오프라인 매장 5곳을 운영하며, 온·오프라인을 아우르는 고객 중심 서비스를 제공하고 있습니다.
                    </p>
                    <p>
                        누적 고객 4만 명, 누적 판매 16만 건이라는 기록은 정직한 서비스와 투명한 고객 응대로 쌓아온 결과이며, 지금도 전국 각지에서 고객들이 KT마켓을 다시 찾고, 추천해주고 계십니다.
                    </p>
                    <p>
                        KT마켓은 단순한 유통을 넘어, 복잡한 통신 상품을 고객 눈높이에 맞게 설명하고, 전문 상담을 통해 더 나은 선택을 안내하는 것에 가치를 둡니다.
                    </p>
                    <p>
                        모든 제품은 KT의 공식 유통망을 통해 출고되는 정품·새제품이며, 고객 한 분 한 분을 내 가족처럼 여기는 마음으로 정직하고 깊이 있는 상담과 판매를 이어가고 있습니다.
                    </p>
                    <p>
                        언제나 고객의 곁에서 가장 믿을 수 있는 통신 플랫폼으로 남겠습니다.
                    </p>
                </section>

                <hr className="border-gray-200 my-8" />

                <section className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <span className="font-bold text-gray-500 w-24 inline-block">회사명</span>
                        <span>케이티준텔레콤</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-500 w-24 inline-block">설립연도</span>
                        <span>2012년 8월</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-500 w-24 inline-block">가입자</span>
                        <span>4만명(2025년 기준)</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-500 w-24 inline-block">대표이사</span>
                        <span>백재준</span>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-bold text-gray-500 w-24 inline-block align-top">소재지</span>
                        <span className="inline-block">경상남도 창원시 성상구 마디미로 22번길 12(상남동)</span>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-bold text-gray-500 w-24 inline-block align-top">주요사업</span>
                        <span className="inline-block">유무선 통신 상품 및 서비스 판매, CS, AS 등</span>
                    </div>
                </section>

                <hr className="border-gray-200 my-8" />

                <section>
                    <h3 className="font-bold mb-4 text-base">사업영역</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-5 rounded-xl">
                            <h4 className="font-bold mb-2 text-[#E60000]">오프라인 판매</h4>
                            <p className="text-gray-600">직영 소매점을 통한 유무선 상품판매</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-xl">
                            <h4 className="font-bold mb-2 text-[#E60000]">온라인 판매</h4>
                            <p className="text-gray-600">
                                KT마켓 NEW 공식홈<br />
                                (https://ktmarket.co.kr)<br />
                                (https://ktemall.com)<br />
                                온라인 채널 통신 상품 판매
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-12 text-right text-gray-500 text-xs">
                    <p>공고일자 : 2023년 2월 1일</p>
                    <p>시행일자 : 2023년 2월 1일</p>
                </div>
            </div>
        </div>
    );
}
