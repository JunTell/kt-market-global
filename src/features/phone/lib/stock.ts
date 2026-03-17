export const checkIsSoldOut = (prefix: string, _cap: string, _col: string) => {
    // 아이폰 17 (aip17) -> 품절 없음 (요청에 의해 모든 규칙 제거)

    // 아이폰 17 프로 (aip17p) -> 전체 품절
    if (prefix === "aip17p") return true

    // 아이폰 17 프로 맥스 (aip17pm) -> 전체 품절
    if (prefix === "aip17pm") return true
    return false
}
