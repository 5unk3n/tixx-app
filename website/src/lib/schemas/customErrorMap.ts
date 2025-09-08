import { z } from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
	switch (issue.code) {
		case z.ZodIssueCode.invalid_type:
			return { message: '올바른 형식이 아닙니다.' }
		case z.ZodIssueCode.too_small: {
			const { minimum } = issue
			return { message: `${minimum}글자 이상으로 설정해주세요` }
		}
		case z.ZodIssueCode.too_big: {
			const { maximum } = issue
			return { message: `${maximum}글자 이내로 설정해주세요` }
		}
		case z.ZodIssueCode.custom: {
			const params = issue.params || {}
			if (params.myField) {
				return { message: `Bad input: ${params.myField}` }
			}
		}
	}

	return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)
