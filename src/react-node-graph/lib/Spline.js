import React from "react";
import onClickOutside from "react-onclickoutside";

import TrashIcon from "./TrashIcon";

class Spline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      position: { x: 0, y: 0 }
    };
  }

  handleClick(e) {
    this.setState({
      selected: !this.state.selected,
      position: this.props.mousePos
    });
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  handleClickOutside(e) {
    this.setState({ selected: false });

    if (this.props.onClickOutside) {
      this.props.onClickOutside(e);
    }
  }

  handleRemove(e) {
    this.setState({ selected: false });

    if (this.props.onRemove) {
      this.props.onRemove(e);
    }
  }





    drawPath(startX, startY, endX, endY) {

        var arc1 = 0; var arc2 = 1; var arcSize = 20;
        var deltaX = arcSize;
        var deltaY = arcSize;
        if ((startY > endY)){
            arc1 = 1;
            arc2 = 0;
            deltaY = -arcSize;
            if((startX-endX > 0)){
                arc1 = 0;
                arc2 = 1;
            }
        }else {
            if((startX-endX > 0)){
                arc1 = 1;
                arc2 = 0;
            }
        }

        if (startX > endX) {
            deltaX = -arcSize;
        }

        let vf = (startX+((endX-startX)/2)-deltaX);

        if(Math.abs(startY-endY) > 30){
            return ("M" + startX + " " + startY +
                " H" + vf +
                " A" + deltaX + " " + deltaY + " 0 0 " + arc2 + " " + (vf + deltaX) + " " + (startY + deltaY) +
                " V" + (endY - deltaY) +
                " A" + deltaX + " " + deltaY + " 0 0 " + arc1 + " " + (vf + (deltaX * 2)) + " " + (endY) +
                " H" + (endX)
            );
        }
        return ("M" + startX + " " + startY + "L" + endX + " " + endY );

    }



  render() {
    let { selected, position } = this.state;

    let { start, end } = this.props;

      let pathString = this.drawPath(
          start.x, // start x
          start.y, // start y
          end.x, // end x
          end.y
      ); // end y


    let className = "connector" + (selected ? " selected" : "");

    return (
      <g>
        <path
          strokeDasharray="5,5"
          className="connector-click-area"
          d={pathString}
          onClick={e => {
            this.handleClick(e);
          }}
        />
        <path
          strokeDasharray="5,5"
          className={className}
          d={pathString}
          onClick={e => {
            this.handleClick(e);
          }}
        />
          <circle cx={start.x-1} cy={start.y-1} style={{zIndex:9999999}} r="9" fill="#337ab7" />
          <circle cx={end.x+2} cy={end.y+1}  style={{zIndex:9999999}} r="9" fill="#9191A8" />
        {selected ? (
          <TrashIcon
            position={position}
            onClick={e => {
              this.handleRemove(e);
            }}
          />
        ) : null}
      </g>
    );
  }

  bezierCurve(a, b, cp1x, cp1y, cp2x, cp2y, x, y) {
    return `M${a},${b} C${cp1x},${cp1y} ${cp2x},${cp2y}  ${x},${y}`;
  }

  distance(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
  }
}

export default onClickOutside(Spline);
