const { addOptionalProperty, colorToRGBA, doRound } = require('./processShared')


const processLayerStyles = (layerStyles, filepath, outputFolder) => {
    let ret = []

    layerStyles.forEach((style)=>{
        let layerStyle = style.value
        let contextSettings = layerStyle.contextSettings
        let data = {
            name: style.name,
            style: []
        }
        addOptionalProperty("background", data.style, layerFill(layerStyle) )
        addOptionalProperty("border", data.style, layerBorder(layerStyle) )
        addOptionalProperty("shadow", data.style, layerShadow(layerStyle) )
        addOptionalProperty("blur", data.style, layerBlur(layerStyle) )

        ret.push(data)
    })

    return ret
}

module.exports = {processLayerStyles: processLayerStyles}

const layerFill = (layerStyle) => {
    let fills = layerStyle.fills

    if (fills !== undefined && fills.length > 0) {
      let backgroundArray = []
      for(let i=0;i<fills.length;i++){
        let fill = fills[i]

        if (fill.fillType == 0 && fill.isEnabled == true) { // Solid Color
            backgroundArray.push(`${colorToRGBA(fill.color.red, fill.color.green, fill.color.blue, fill.color.alpha)}`)
        }

        if (fill.fillType == 1 && fill.isEnabled == true) { // Gradients

          if (fill.gradient.gradientType == 0) { // Linear Gradients
            let gradientStops = []
            let coords1 = JSON.parse( "[" + fill.gradient.from.slice(1,-1) + "]")
            let coords2 = JSON.parse( "[" + fill.gradient.to.slice(1,-1) + "]")
            for(let i=0;i<fill.gradient.stops.length;i++){
              let stop = fill.gradient.stops[i]
              gradientStops.push(`.init(color: ${colorToRGBA(stop.color.red, stop.color.green, stop.color.blue, stop.color.alpha)}, location: ${stop.position})`)
            }
            backgroundArray.push(`LinearGradient(gradient: Gradient(stops:[${gradientStops}]), startPoint: UnitPoint(x: ${doRound(coords1[0])}, y: ${doRound(coords1[1])}), endPoint: UnitPoint(x: ${doRound(coords2[0])}, y: ${doRound(coords2[1])}))`)
          }

          if (fill.gradient.gradientType == 1) { // Radial Gradients
            let gradientStops = []
            let coords1 = JSON.parse( "[" + fill.gradient.from.slice(1,-1) + "]")
            for(let i=0;i<fill.gradient.stops.length;i++){
              let stop = fill.gradient.stops[i]
              gradientStops.push(`.init(color: ${colorToRGBA(stop.color.red, stop.color.green, stop.color.blue, stop.color.alpha)}, location: ${stop.position})`)
            }
            backgroundArray.push(`RadialGradient(gradient: Gradient(stops:[${gradientStops}]), center: UnitPoint(x: ${doRound(coords1[0])}, y: ${doRound(coords1[1])}), startRadius: 1, endRadius: 100)`)
          }

          if (fill.gradient.gradientType == 2) { // Angular Gradients
            let gradientStops = []
            for(let i=0;i<fill.gradient.stops.length;i++){
              let stop = fill.gradient.stops[i]
              gradientStops.push(`.init(color: ${colorToRGBA(stop.color.red, stop.color.green, stop.color.blue, stop.color.alpha)}, location: ${doRound(stop.position)})`)
            }
            backgroundArray.push(`AngularGradient(gradient: Gradient(stops:[${gradientStops}]), center: .center, startAngle: .degrees(0), endAngle: .degrees(360))`)
          }

        }

      }
      return backgroundArray
    }
    // return "Color.clear"
}

const layerShadow = (layerStyles) => {
  let shadows = layerStyles.shadows
  if (shadows !== undefined && shadows.length > 0) {
      let shadowArray = []
      for(let i=0;i<shadows.length;i++){
        let shadow = shadows[i]
        if (shadow.isEnabled == true) {
          let shadowColor = colorToRGBA(shadow.color.red, shadow.color.green, shadow.color.blue, shadow.color.alpha)
          shadowArray.push(`color: ${shadowColor}, radius: ${shadow.blurRadius}, x: ${doRound(shadow.offsetX)}, y: ${doRound(shadow.offsetY)}`)
        }
      }
      return shadowArray
  }
  // return "Color.clear"
}

const layerBorder = (layerStyles) => {
  let borders = layerStyles.borders
  if (borders !== undefined && borders.length > 0) {
      let borderArray = []

      for(let i=0;i<borders.length;i++){
        let border = borders[i]

        if (border.fillType == 0 && border.isEnabled == true) { // Solid Color
            let borderColor = colorToRGBA(border.color.red, border.color.green, border.color.blue, border.color.alpha)
            borderArray.push(`${borderColor}, width: ${border.thickness}`)
        }

        if (border.fillType == 1 && border.isEnabled == true) { // Gradients

          if (border.gradient.gradientType == 0) { // Linear Gradients
            let gradientStops = []
            let coords1 = JSON.parse( "[" + border.gradient.from.slice(1,-1) + "]")
            let coords2 = JSON.parse( "[" + border.gradient.to.slice(1,-1) + "]")
            for(let i=0;i<border.gradient.stops.length;i++){
              let stop = border.gradient.stops[i]
              gradientStops.push(`.init(color: ${colorToRGBA(stop.color.red, stop.color.green, stop.color.blue, stop.color.alpha)}, location: ${stop.position})`)
            }
            borderArray.push(`LinearGradient(gradient: Gradient(stops:[${gradientStops}]), startPoint: UnitPoint(x: ${doRound(coords1[0])}, y: ${doRound(coords1[1])}), endPoint: UnitPoint(x: ${doRound(coords2[0])}, y: ${doRound(coords2[1])})), width: ${border.thickness}`)
          }

          if (border.gradient.gradientType == 1) { // Radial Gradients
            let gradientStops = []
            let coords1 = JSON.parse( "[" + border.gradient.from.slice(1,-1) + "]")
            for(let i=0;i<border.gradient.stops.length;i++){
              let stop = border.gradient.stops[i]
              gradientStops.push(`.init(color: ${colorToRGBA(stop.color.red, stop.color.green, stop.color.blue, stop.color.alpha)}, location: ${stop.position})`)
            }
            borderArray.push(`RadialGradient(gradient: Gradient(stops:[${gradientStops}]), center: UnitPoint(x: ${doRound(coords1[0])}, y: ${doRound(coords1[1])}), startRadius: 1, endRadius: 100), width: ${border.thickness}`)
          }

          if (border.gradient.gradientType == 2) { // Angular Gradients
            let gradientStops = []
            for(let i=0;i<border.gradient.stops.length;i++){
              let stop = border.gradient.stops[i]
              gradientStops.push(`.init(color: ${colorToRGBA(stop.color.red, stop.color.green, stop.color.blue, stop.color.alpha)}, location: ${doRound(stop.position)})`)
            }
            borderArray.push(`AngularGradient(gradient: Gradient(stops:[${gradientStops}]), center: .center, startAngle: .degrees(0), endAngle: .degrees(360)), width: ${border.thickness}`)
          }

        }

      }

      return borderArray
  }

}

const layerBlur = (layerStyles) => {
  let blur = layerStyles.blur
  if (blur.isEnabled == true) {
    return `radius: ${blur.radius}`
  }
}