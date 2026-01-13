export type RegType = "chg" | "mnp"

interface Device {
  category?: string
  thumbnail?: string
  [key: string]: unknown
}

interface SubsidyRow {
  [key: string]: unknown
}

export function getDeviceImageUrl(device: Device): string {
  if (!device?.category || !device?.thumbnail) return ""

  return `${process.env.NEXT_PUBLIC_CDN_URL}/phone/${device.category}/${device.thumbnail}/01.png`
}

export function getDeviceImageUrls(device: Device): string[] {
  const mainImage = getDeviceImageUrl(device)
  // 추가 이미지가 있다면(02.png, 03.png 등) 여기에 로직 추가 가능
  return [mainImage]
}

export function calcKTmarketSubsidy(
  planId: string,
  planPrice: number,
  subsidyRow: SubsidyRow | undefined,
  model: string,
  registrationType: RegType
): number {
  if (!subsidyRow) {
    return 0
  }
  if (planPrice <= 0) {
    return 0
  }

  const discount = "device"
  const register = registrationType

  const forceTierByPlanId: Record<string, number> = {
    ppllistobj_0893: 61000,
    ppllistobj_0778: 61000,
    ppllistobj_0844: 61000,
    ppllistobj_0845: 37000,
    ppllistobj_0535: 37000,
    ppllistobj_0765: 37000,
    ppllistobj_0775: 37000,
  }

  const forcedTier = forceTierByPlanId[planId]
  const priceTiers = [110000, 100000, 90000, 61000, 37000]
  let matchedKey = ""

  if (forcedTier) {
    matchedKey = `${discount}_discount_${register}_gte_${forcedTier}`
  } else {
    for (const tier of priceTiers) {
      if (planPrice >= tier) {
        matchedKey = `${discount}_discount_${register}_gte_${tier}`
        break
      }
    }
    if (!matchedKey) {
      matchedKey = `${discount}_discount_${register}_lt_37000`
    }
  }

  const subsidy = Number(subsidyRow[matchedKey]) || 0

  if (planId === "ppllistobj_0808") {
    return 100000
  }

  return subsidy
}