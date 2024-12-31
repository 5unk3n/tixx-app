const fontFamily = {
	regular: 'Pretendard-Regular',
	medium: 'Pretendard-Medium',
	semibold: 'Pretendard-SemiBold'
}

const fontSizes = {
	xs: 12,
	sm: 14,
	md: 15,
	base: 16,
	lg: 18,
	xl: 20,
	'2xl': 24
}

const lineHeights = {
	xs: 14,
	sm: 16,
	md: 18,
	base: 20,
	lg: 22,
	xl: 28,
	'2xl': 32
}

const letterSpacings = {
	tight: -0.02,
	normal: 0
}

const typography = {
	body1Medium: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.base,
		lineHeight: lineHeights.md,
		letterSpacing: letterSpacings.tight,
		fontWeight: '500'
	},
	body1Semibold: {
		fontFamily: fontFamily.semibold,
		fontSize: fontSizes.base,
		lineHeight: lineHeights.md,
		letterSpacing: letterSpacings.tight,
		fontWeight: '600'
	},
	body1Regular: {
		fontFamily: fontFamily.regular,
		fontSize: fontSizes.base,
		lineHeight: lineHeights.md,
		letterSpacing: letterSpacings.tight,
		fontWeight: '400'
	},
	body1RegularLarge: {
		fontFamily: fontFamily.regular,
		fontSize: fontSizes.base,
		lineHeight: lineHeights.lg,
		letterSpacing: letterSpacings.tight,
		fontWeight: '400'
	},
	body1MediumLarge: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.base,
		lineHeight: lineHeights.lg,
		letterSpacing: letterSpacings.tight,
		fontWeight: '500'
	},
	headline1Medium: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.xl,
		lineHeight: lineHeights.xl,
		letterSpacing: letterSpacings.tight,
		fontWeight: '500'
	},
	headline1Semibold: {
		fontFamily: fontFamily.semibold,
		fontSize: fontSizes.xl,
		lineHeight: lineHeights.xl,
		letterSpacing: letterSpacings.tight,
		fontWeight: '600'
	},
	h1Semibold: {
		fontFamily: fontFamily.semibold,
		fontSize: fontSizes['2xl'],
		lineHeight: lineHeights['2xl'],
		letterSpacing: letterSpacings.tight,
		fontWeight: '600'
	},
	caption1Regular: {
		fontFamily: fontFamily.regular,
		fontSize: fontSizes.xs,
		lineHeight: lineHeights.xs,
		letterSpacing: letterSpacings.tight,
		fontWeight: '400'
	},
	caption1Medium: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.xs,
		lineHeight: lineHeights.xs,
		letterSpacing: letterSpacings.tight,
		fontWeight: '500'
	},
	caption1RegularLarge: {
		fontFamily: fontFamily.regular,
		fontSize: fontSizes.xs,
		lineHeight: lineHeights.sm,
		letterSpacing: letterSpacings.tight,
		fontWeight: '400'
	},
	body3Medium: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.sm,
		lineHeight: lineHeights.sm,
		letterSpacing: letterSpacings.tight,
		fontWeight: '500'
	},
	body3Regular: {
		fontFamily: fontFamily.regular,
		fontSize: fontSizes.sm,
		lineHeight: lineHeights.sm,
		letterSpacing: letterSpacings.tight,
		fontWeight: '400'
	},
	body3RegularLarge: {
		fontFamily: fontFamily.regular,
		fontSize: fontSizes.sm,
		lineHeight: lineHeights.base,
		letterSpacing: letterSpacings.tight,
		fontWeight: '400'
	},
	body2Medium: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.md,
		lineHeight: lineHeights.sm,
		letterSpacing: letterSpacings.tight,
		fontWeight: '500'
	},
	headline2Medium: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.lg,
		lineHeight: lineHeights.base,
		letterSpacing: letterSpacings.tight,
		fontWeight: '500'
	},
	headline2MediumLarge: {
		fontFamily: fontFamily.medium,
		fontSize: fontSizes.lg,
		lineHeight: lineHeights.lg,
		letterSpacing: letterSpacings.normal,
		fontWeight: '500'
	}
}

module.exports = {
	fontFamily,
	fontSizes,
	lineHeights,
	letterSpacings,
	typography
}
