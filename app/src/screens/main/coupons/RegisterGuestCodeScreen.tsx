import React, { useState } from 'react'
import { View } from 'react-native'

import CouponRegistration from '@/components/coupons/CouponRegistration'
import CouponVerification from '@/components/coupons/CouponVerification'
import { CouponVerifyResponse } from '@/types'

export type Ticket = Pick<CouponVerifyResponse, 'ticket'>['ticket']

export default function RegisterGuestCodeScreen() {
	const [registrationData, setRegistrationData] = useState<{
		code: string
		ticket: Ticket | null
	}>({
		code: '',
		ticket: null
	})
	const [step, setStep] = useState(0)

	return (
		<View className="flex-1">
			{step === 0 && (
				<CouponVerification
					onVerifyCoupon={(data: { code: string; ticket: Ticket | null }) => {
						setRegistrationData(data)
						setStep(1)
					}}
				/>
			)}
			{step === 1 && (
				<CouponRegistration
					code={registrationData.code}
					ticket={registrationData.ticket!}
					onPreviousStep={() => {
						setRegistrationData({ code: '', ticket: null })
						setStep(0)
					}}
				/>
			)}
		</View>
	)
}
