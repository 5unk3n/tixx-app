import {
	ColumnDef,
	Row,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	SortingState,
	ColumnFiltersState,
	OnChangeFn
} from '@tanstack/react-table'
import { useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '../ui/table'

import Minus from '@/assets/icons/minus.svg?react'
import Plus from '@/assets/icons/plus.svg?react'
import { useTransferEventTickets } from '@/hooks/queries/tickets/useTransferEventTickets'
import { ContactWithUserInfo } from '@/types'
import { formatPhone } from '@/utils/formatters'

interface ContactListProps {
	contacts: ContactWithUserInfo[]
	searchQuery: string
	ticketId: number
}

export default function ContactList({
	contacts,
	searchQuery,
	ticketId
}: ContactListProps) {
	const { t } = useTranslation()
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<
		Record<string, boolean>
	>({})
	const { mutateAsync: transferEventTickets } = useTransferEventTickets()

	// 연락처별 수량 상태 관리
	const [quantities, setQuantities] = useState<{ [phone: string]: number }>(
		() => Object.fromEntries(contacts.map((c) => [c.phone, 1]))
	)

	// 일괄적용 기준 수량 상태
	const [bulkQuantity, setBulkQuantity] = useState(1)

	// 일괄 수량 조절 핸들러 (모든 연락처의 수량을 bulkQuantity로 맞춤)
	const handleBulkQuantityChange = (delta: number) => {
		setBulkQuantity((prev) => {
			const next = Math.max(1, prev + delta)
			setQuantities(() => {
				const nextQuantities: { [phone: string]: number } = {}
				contacts.forEach((c) => {
					nextQuantities[c.phone] = next
				})
				return nextQuantities
			})
			return next
		})
	}

	// contacts가 바뀌면 bulkQuantity도 동기화(최초 1, 아니면 기존 bulkQuantity 유지)
	useMemo(() => {
		setQuantities((prev) => {
			const next: { [phone: string]: number } = {}
			contacts.forEach((c) => {
				next[c.phone] = prev[c.phone] || bulkQuantity
			})
			return next
		})
	}, [bulkQuantity, contacts])

	// 개별 수량 조절 핸들러
	const handleQuantityChange = useCallback((phone: string, delta: number) => {
		setQuantities((prev) => {
			const next = { ...prev }
			next[phone] = Math.max(1, (next[phone] || 1) + delta)
			return next
		})
	}, [])

	// 검색 필터 적용
	const filteredContacts = useMemo(
		() =>
			contacts.filter(
				(contact) =>
					contact.name.includes(searchQuery) ||
					formatPhone(contact.phone).includes(searchQuery)
			),
		[contacts, searchQuery]
	)

	// DataTable columns
	const columns = useMemo<ColumnDef<ContactWithUserInfo, unknown>[]>(
		() =>
			[
				{
					id: 'select',
					header: ({ table }) => (
						<Checkbox
							checked={
								table.getIsAllPageRowsSelected() ||
								(table.getIsSomePageRowsSelected() && 'indeterminate')
							}
							onCheckedChange={(value) =>
								table.toggleAllPageRowsSelected(!!value)
							}
							aria-label="Select all"
						/>
					),
					cell: ({ row }) => (
						<Checkbox
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(!!value)}
							aria-label="Select row"
						/>
					),
					enableSorting: false,
					enableHiding: false,
					size: 40,
					minSize: 40,
					maxSize: 40
				},
				{
					accessorKey: 'name',
					header: t('common.name'),
					cell: ({ row }) => <div>{row.original.name}</div>
				},
				{
					accessorKey: 'phone',
					header: t('common.phone'),
					cell: ({ row }) => <div>{formatPhone(row.original.phone)}</div>
				},
				{
					accessorKey: 'nickname',
					header: t('common.nickname'),
					cell: ({ row }) => <div>{row.original.nickname}</div>
				},
				{
					accessorKey: 'quantity',
					header: t('common.quantity'),
					cell: ({ row }) => (
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleQuantityChange(row.original.phone, -1)}
								className="h-5 w-5"
							>
								<Minus className="rounded-md border" />
							</Button>
							<span>{quantities[row.original.phone] || 1}</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleQuantityChange(row.original.phone, 1)}
								className="h-5 w-5"
							>
								<Plus className="rounded-md border" />
							</Button>
						</div>
					)
				},
				{
					id: 'actions',
					enableHiding: false,
					cell: ({ row }) => (
						<Button
							variant={'grayLine'}
							size={'sm'}
							onClick={async () => {
								if (!ticketId) {
									toast.error(t('ticket.selectTicket'))
									return
								}
								try {
									const payload = [
										{
											ticketId: ticketId,
											toPhoneNumber: row.original.phone,
											toUserId: row.original.userId || undefined,
											quantity: quantities[row.original.phone] || 1
										}
									]
									await transferEventTickets(payload)
									toast.success(t('invitation.sent'))
								} catch (error) {
									console.error(error)
									toast.error(t('invitation.sendFailed'))
								}
							}}
						>
							{t('ticket.send')}
						</Button>
					)
				}
			] as const,
		[t, quantities, handleQuantityChange, ticketId, transferEventTickets]
	)

	const table = useReactTable({
		data: filteredContacts,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting as OnChangeFn<SortingState>,
		onColumnFiltersChange: setColumnFilters as OnChangeFn<ColumnFiltersState>,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		enableRowSelection: true
	})

	const handleSendAll = async () => {
		if (!ticketId) {
			toast.error(t('ticket.selectTicket'))
			return
		}
		const selectedRows = table.getFilteredSelectedRowModel().rows
		if (selectedRows.length === 0) return
		try {
			const payload = selectedRows.map((row: Row<ContactWithUserInfo>) => ({
				ticketId: ticketId,
				toPhoneNumber: row.original.phone,
				toUserId: row.original.userId || undefined,
				quantity: quantities[row.original.phone] || 1
			}))
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			await transferEventTickets(payload.map(({ quantity, ...rest }) => rest))
			toast.success(t('invitation.sent'))
		} catch (error) {
			console.error(error)
			toast.error(t('invitation.sendFailed'))
		}
	}

	return (
		<>
			<div className="rounded-xl border">
				<div className="flex items-center border-b px-6 py-5">
					<p className="mr-auto text-headline-1 font-semibold">
						{t('ticket.selectQuantity')}
						<span className="ml-4 text-body-1 font-medium">{`${table.getFilteredSelectedRowModel().rows.length}/${table.getFilteredRowModel().rows.length}`}</span>
					</p>
					<div className="flex items-center">
						<span className="text-label-1 font-medium text-grayscale-600">
							{t('ticket.bulkQuantityApply')}
						</span>
						<div className="ml-2 flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleBulkQuantityChange(-1)}
								className="h-5 w-5"
							>
								<Minus className="rounded-md border" />
							</Button>
							<span>
								{bulkQuantity}
								{t('ticket.countUnit')}
							</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleBulkQuantityChange(1)}
								className="h-5 w-5"
							>
								<Plus className="rounded-md border" />
							</Button>
						</div>
					</div>
				</div>
				{/* 내부 스크롤을 위한 wrapper */}
				<div style={{ maxHeight: 500, overflowY: 'auto' }}>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: header.column.columnDef.header &&
													  typeof header.column.columnDef.header === 'function'
													? header.column.columnDef.header(header.getContext())
													: header.column.columnDef.header}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
										className={row.getIsSelected() ? 'bg-gray-100' : ''}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{cell.column.columnDef.cell &&
												typeof cell.column.columnDef.cell === 'function'
													? cell.column.columnDef.cell(cell.getContext())
													: cell.column.columnDef.cell}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										{t('common.noData')}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			<div className="mt-[60px] flex justify-center">
				<Button variant={'black'} onClick={handleSendAll} className="w-[315px]">
					{t('ticket.sendAll')}
				</Button>
			</div>
		</>
	)
}
