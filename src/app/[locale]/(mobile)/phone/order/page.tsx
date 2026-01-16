import { createClient } from "@/shared/api/supabase/client"
import { getDBModelKey, parsePhoneModel } from "@/features/phone/lib/phoneModel"
import OrderPageClient from "@/features/phone/components/order/OrderPageClient"
import { Metadata } from "next"

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

import { unstable_cache } from "next/cache"

const getDeviceData = unstable_cache(
  async (modelFromUrl: string | null) => {
    if (!modelFromUrl) return null

    const supabase = createClient()
    try {
      const { prefix, capacity } = parsePhoneModel(modelFromUrl)
      const dbModelKey = getDBModelKey(prefix, capacity)

      const { data: device } = await supabase
        .from("devices")
        .select("*")
        .eq("model", dbModelKey)
        .single()

      return device
    } catch (error) {
      console.error("Fetch Error:", error)
      return null
    }
  },
  ["device-data"],
  {
    tags: ["device-data"],
    revalidate: 3600, // 1 hour default revalidation
  }
)

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const modelFromUrl = typeof resolvedSearchParams.model === 'string' ? resolvedSearchParams.model : null
  const device = await getDeviceData(modelFromUrl)

  if (device) {
    const title = `Order ${device.pet_name} - KT Market Global`
    const description = `Get your ${device.pet_name} (${device.capacity}) from KT Market. Best price and simple massive discount.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      }
    }
  }

  return {
    title: "Order Phone - KT Market Global",
    description: "Order your new phone from KT Market Global.",
  }
}

export default async function OrderPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const modelFromUrl = typeof resolvedSearchParams.model === 'string' ? resolvedSearchParams.model : null
  const initialDeviceData = await getDeviceData(modelFromUrl)

  return (
    <OrderPageClient
      initialDeviceData={initialDeviceData}
      modelFromUrl={modelFromUrl}
    />
  )
}