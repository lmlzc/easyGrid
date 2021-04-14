import React from 'react'

const EditableCell = ({
    value: initialValue,
    row,
    column,
    updateMyData,
    setFocusCell,
    focusCell
}) => {
    console.log(column, row, initialValue)
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        setFocusCell(null)
        if (value !== initialValue) {
            updateMyData(row.index, column.id, value)
        }
    }
    const focusId = column.id + '-' + row.id

    const setFocusHandle = () => {
        setFocusCell(focusId)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    const renderImageCell = () => {
        console.log(value)
        return (
            <img src={value}></img>
        )
    }
    const renderTextCell = () => {
        return <span >{value}</span>
    }
    const renderCell = () => (
        <div className='cellWrapper' onClick={setFocusHandle}>
            {column.id === 'img' ? renderImageCell() : renderTextCell()}
        </div>
    )
    return (
        <div className='customCell'>
            {focusId === focusCell ? <div className='cellWrapper'><input autoFocus value={value} onChange={onChange} onBlur={onBlur} /> </div> : renderCell()}
        </div>
    )
}
export default EditableCell