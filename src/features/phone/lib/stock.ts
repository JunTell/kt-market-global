export const checkIsSoldOut = (prefix: string, cap: string, col: string) => {
    // 규칙 1: 아이폰 17 (aip17) + 256GB -> 블랙, 미스트블루, 라벤더 품절
    if (prefix === "aip17" && cap === "256") {
        if (["black", "mist_blue", "lavender"].includes(col)) return true
    }
    // 규칙 2: 아이폰 17 (aip17) + 512GB -> 블랙 품절
    if (prefix === "aip17" && cap === "512") {
        if (["black"].includes(col)) return true
    }
    // 규칙 3: 아이폰 17 프로 (aip17p) + 1TB -> 실버 제외 품절
    if (prefix === "aip17p" && cap === "1t") {
        if (col !== "silver") return true
    }
    // 규칙 4: 아이폰 17 프로 맥스 (aip17pm)
    if (prefix === "aip17pm") {
        if (cap === "1t") return true
        else if (col !== "silver") return true
    }
    return false
}
