import arcjet, { detectBot, shield, tokenBucket } from '@arcjet/next'

const arcjetKey = process.env.ARCJET_KEY?.trim()

export const arcjetClient = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({
          mode: 'LIVE',
          allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:MONITOR'],
        }),
        tokenBucket({
          mode: 'LIVE',
          refillRate: 30,
          interval: '1m',
          capacity: 60,
        }),
      ],
    })
  : null

type ArcjetRequestProps = {
  requested?: number
  [key: string]: unknown
}

export async function protectArcjetRequest(
  request: Request,
  props: ArcjetRequestProps = { requested: 1 }
) {
  if (!arcjetClient) {
    return {
      allowed: true,
      skipped: true,
      decision: null,
    }
  }

  const decision = await arcjetClient.protect(request, {
    ...props,
    requested: props.requested ?? 1,
  })

  return {
    allowed: !decision.isDenied(),
    skipped: false,
    decision,
  }
}

export const getArcjetClient = () => arcjetClient
