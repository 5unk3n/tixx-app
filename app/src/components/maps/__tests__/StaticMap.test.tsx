import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render } from '@testing-library/react-native'
import React from 'react'
import * as RN from 'react-native'

import { getStaticMapUrl } from '@/apis/maps/getStaticMapUrl'

import { TestWrapper } from '../../testUtils/TestWrapper'
import StaticMap from '../StaticMap'

describe('StaticMap', () => {
	beforeEach(() => {
		jest.spyOn(RN, 'useWindowDimensions').mockReturnValue({
			width: 384,
			height: 800,
			scale: 2,
			fontScale: 2
		} as any)
	})

	it('기본 크기에서 정적 지도 이미지를 올바른 파라미터로 요청한다', () => {
		const { UNSAFE_getAllByType } = render(
			<StaticMap longitude="127.0" latitude="37.5" />,
			{ wrapper: TestWrapper }
		)
		const images = UNSAFE_getAllByType(RN.Image)
		expect(images.length).toBe(2)
		const mapImage: any = images[0]
		const expectedUri = getStaticMapUrl({
			center: '127.0 37.5',
			w: '718',
			h: '160',
			lang: 'en'
		})
		expect(mapImage.props.source.uri).toBe(expectedUri)
		// 헤더는 환경에 따라 다를 수 있어 키 존재 여부만 확인
		expect(
			mapImage.props.source.headers['x-ncp-apigw-api-key-id']
		).toBeDefined()
		expect(mapImage.props.source.headers['x-ncp-apigw-api-key']).toBeDefined()
		expect(mapImage.props.width).toBe(718)
		expect(mapImage.props.height).toBe(160)
	})

	it('width/height prop을 전달하면 해당 크기를 사용한다', () => {
		const { UNSAFE_getAllByType } = render(
			<StaticMap longitude="127.0" latitude="37.5" width={200} height={100} />,
			{ wrapper: TestWrapper }
		)
		const images = UNSAFE_getAllByType(RN.Image)
		const mapImage: any = images[0]
		const expectedUri = getStaticMapUrl({
			center: '127.0 37.5',
			w: '200',
			h: '100',
			lang: 'en'
		})
		expect(mapImage.props.source.uri).toBe(expectedUri)
		expect(mapImage.props.width).toBe(200)
		expect(mapImage.props.height).toBe(100)
	})
})
