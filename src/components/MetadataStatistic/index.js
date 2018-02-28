import React, { PureComponent } from 'react'
import cx from 'classnames'
import { PieChart, Pie, Cell, Sector } from 'recharts'
import { map, keys } from 'ramda'
import styles from './index.css'

const colorMap = {
  '#27ae60': '#2ecc71',
  '#f39c12': '#f1c40f',
  '#bdc3c7': '#ecf0f1'
}

const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle,
    fill, payload
  } = props
  const fontSizeMain = innerRadius * 0.6
  const fontSizeSub = innerRadius * 0.3
  const padding = innerRadius * 0.05
  const color = colorMap[fill]

  return (
    <g>
      <text
        x={cx} y={cy}
        dy={-padding / 2}
        fontSize={fontSizeMain}
        textAnchor="middle"
        fill={color}
      >
        { payload.value }
      </text>
      <text
        x={cx} y={cy}
        dy={fontSizeSub + padding / 2}
        fontSize={fontSizeSub}
        textAnchor="middle"
        fill="#fff"
      >
        { payload.name }
      </text>
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        fill={color}
      />
    </g>
  )
}

class MetadataStatistic extends PureComponent {
  static defaultProps = {
    className: '',
    side: 100,
    valid: 0,
    invalid: 0,
    missing: 0
  }

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 2
    }
  }

  onPieEnter = (data, activeIndex) => {
    this.setState({ activeIndex })
  }

  render() {
    const { id, className, side, valid, invalid, missing } = this.props
    const { activeIndex } = this.state
    const innerRadius = side / 2 * 0.6
    const outerRadius = side / 2 * 0.8

    return (
      <PieChart id={id} className={cx(styles.main, className)} width={side} height={side}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          dataKey="value"
          data={[
            { name: '格式正確', value: valid },
            { name: '格式錯誤', value: invalid },
            { name: '未填寫', value: missing }
          ]}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={5}
          onMouseEnter={this.onPieEnter}
        >
          { map(c => <Cell key={c} stroke={0} fill={c} />, keys(colorMap)) }
        </Pie>
      </PieChart>
    )
  }
}

export default MetadataStatistic
