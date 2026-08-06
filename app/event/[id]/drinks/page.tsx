import { redirect } from 'next/navigation'

/** Default table when QR / path has no table code */
export default async function DrinksIndex({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/event/${id}/drinks/T-05`)
}
