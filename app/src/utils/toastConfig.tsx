import React from 'react'
import { ToastProps } from 'react-native-toast-message'

import CustomToast from '@/components/ui/feedback/CustomToast'

export const toastConfig = {
	error: (props: ToastProps) => <CustomToast icon="error" {...props} />,
	success: (props: ToastProps) => <CustomToast icon="success" {...props} />
}
