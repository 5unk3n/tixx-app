import { z } from 'zod'

import i18n from '../../../i18n'

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
	const { t } = i18n

	switch (issue.code) {
		case z.ZodIssueCode.invalid_type:
			return { message: t('validation.invalidType') }
		case z.ZodIssueCode.too_small:
			const { minimum } = issue
			return { message: t('validation.tooSmall', { minimum }) }
		case z.ZodIssueCode.too_big:
			const { maximum } = issue
			return { message: t('validation.tooBig', { maximum }) }
		case z.ZodIssueCode.custom:
			const params = issue.params || {}
			if (params.myField) {
				return { message: `Bad input: ${params.myField}` }
			}
	}

	return { message: ctx.defaultError }
}
