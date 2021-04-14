import React, { useCallback } from 'react'
import { useTable, usePagination, useColumnOrder, useResizeColumns } from 'react-table'
import { Pagination, Button, Tooltip, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper';
import { colData, rowData } from './mockData'
import Col from './column'
import EditableCell from './cell'
import './index.scss'


export default function Grid() {
  const [data, setData] = React.useState(() => rowData)
  const [focusCell, setFocusCell] = React.useState(null)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const formRef =React.createRef()
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }
  const columnsData = React.useMemo(
    () => colData,
    []
  )
  const defaultColumn = {
    Cell: EditableCell,
    width: 200,
    maxWidth: 300,
    minWidth: 50,
  }
  const tableInstance = useTable(
    { columns: columnsData, data, defaultColumn, initialState: { pageSize: 5, pageIndex: 0 }, updateMyData, setFocusCell, focusCell },
    usePagination,
    useColumnOrder,

  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    allColumns,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    setPageSize,
    setColumnOrder
  } = tableInstance
  console.log(tableInstance)
  function gotoPageHandle(page, pageSize) {
    console.log(page, pageSize)
    setPageSize(pageSize)
    gotoPage(page - 1)
  }
  const moveCol = (dragIndex, hoverIndex) => {
    const dragRecord = allColumns[dragIndex]
    const newCol = update(allColumns, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRecord],
      ],
    })
    setColumnOrder(newCol.map(i => i.id))
  }
  const showAddModal = () => {
    setIsModalVisible(true)

  }
  const confirmAdd = () => {
    console.log(formRef)
    const value =formRef.current.getFieldValue()
    const newData = [...data,value]
    setData(newData)
    setIsModalVisible(false)
  }
  const cancelAdd = () => {
    setIsModalVisible(false)
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='tableWrapper'>
        <table className='eTable' {...getTableProps()}>
          <thead>
            {// Loop over the header rows
              headerGroups.map(headerGroup => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {// Loop over the headers in each row
                    headerGroup.headers.map((column, index) => (
                      // Apply the header cell props
                      <Col index={index}
                        column={column}
                        moveCol={moveCol}
                        {...column.getHeaderProps()}></Col>
                    ))}
                </tr>
              ))}
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
              page.map(row => {
                // Prepare the row for display
                prepareRow(row)
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()}>
                    {// Loop over the rows cells
                      row.cells.map(cell => {
                        // Apply the cell props
                        return (
                          <td {...cell.getCellProps()}>
                            {// Render the cell contents
                              cell.render('Cell')}
                          </td>
                        )
                      })}
                  </tr>
                )
              })}
          </tbody>
        </table>
        <div className='extraOperRow'>
          <Tooltip title="add">
            <Button className='addBtn' type="primary" icon={<PlusOutlined />} onClick={showAddModal} />
          </Tooltip>
        </div>
        <div className='pagingRow'>
          <Pagination
            size="small"
            current={pageIndex + 1}
            pageSizeOptions={[5, 10, 20, 50]}
            pageSize={pageSize}
            total={data.length}
            showSizeChanger
            showQuickJumper
            onChange={gotoPageHandle}
          />
        </div>
      </div >
      <Modal className='addModal' title="Add Product" visible={isModalVisible} onOk={confirmAdd} onCancel={cancelAdd}>
        <Form ref ={formRef}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ message: 'Please input your username!' }]}
          >
            <Input placeholder='Please input Title' />
          </Form.Item>
          <Form.Item
            label="Description"
            name="desc"
            rules={[{ message: 'Please input your username!' }]}
          >
            <Input placeholder='Please input Title' />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ message: 'Please input your username!' }]}
          >
            <Input placeholder='Please input Title' />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quant"
            rules={[{ message: 'Please input your username!' }]}
          >
            <Input placeholder='Please input Title' />
          </Form.Item>
          <Form.Item
            label="Image"
            name="img"
            rules={[{ message: 'Please input your username!' }]}
          >
            <Input placeholder='Please input Image Url' />
          </Form.Item>
        </Form>
      </Modal>
    </DndProvider>
  )
}
