/*
 * Copyright (c) 2015 Mountainstorm
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function( $ ) {
  var $_shapeCache = {}

  loadShape = function (url, complete) {
    if (url in $_shapeCache) {
      complete($_shapeCache[url].clone())
    } else {
      $.get(url, function (svg) {
        var $svg = $("svg", svg);
        var docNode = document.adoptNode($svg[0]);
        $_shapeCache[url] = $(docNode)
        complete($_shapeCache[url].clone())
      }, 'xml')
    }
  }

  BadgeLayer = function (badge, settings, complete) {
    var layer = this
    loadShape(settings.url, function ($shape) {
      layer.badge = badge
      layer.$shape = $shape
      layer.isText = false
      if (layer.$shape.find('text').length) {
        layer.isText = true
      }
      layer.url = settings.url
      layer.fillColor = settings.fillColor ? settings.fillColor : '#000'
      layer.strokeColor = settings.strokeColor ? settings.strokeColor : 'none'
      layer.strokeWidth = settings.strokeWidth ? settings.strokeWidth : 1.0
      layer.strokeStyle = settings.strokeStyle ? settings.strokeStyle : 'none'
      layer.scale = settings.scale ? settings.scale : 1.0
      layer.rotation = settings.rotation ? settings.rotation : 0.0
      layer.dx = settings.dx ? settings.dx : 0.0
      layer.dy = settings.dy ? settings.dy : 0.0
      layer.fontSize = settings.fontSize ? settings.fontSize : 55
      layer.fontFamily = settings.fontFamily ? settings.fontFamily : 'Times New Roman'
      layer.fontWeight = settings.fontWeight ? settings.fontWeight : 'normal'
      layer.letterSpacing = settings.letterSpacing ? settings.letterSpacing : 'normal'
      // setup shapes to use XXX: we can make this better with a resize call
      layer.img = new Image(layer.badge.badgeSize, layer.badge.badgeSize)
      layer.$shape.attr('width', layer.badge.badgeSize + 'px')
      layer.$shape.attr('height', layer.badge.badgeSize + 'px')
      layer.update(complete)
    })
  }

  BadgeLayer.prototype.setting = function (name, value, complete) {
    var layer = this
    layer[name] = value
    layer.update(complete)
  }

  BadgeLayer.prototype.settings = function () {
    var layer = this
    var settings = {
      url: layer.url,
      fillColor: layer.fillColor,
      strokeColor: layer.strokeColor,
      strokeWidth: layer.strokeWidth,
      strokeStyle: layer.strokeStyle,
      scale: layer.scale,
      rotation: layer.rotation,
      dx: layer.dx,
      dy: layer.dy
    }
    if (layer.isText) {
      settings.fontSize = layer.fontSize
      settings.fontFamily = layer.fontFamily
      settings.fontWeight = layer.fontWeight
      settings.letterSpacing = layer.letterSpacing
    }
    return settings
  }

  BadgeLayer.prototype.update = function (complete) {
    // update the svg
    var layer = this
    var viewBox = layer.$shape[0].getAttribute('viewBox').split(' ')
    var width = parseInt(viewBox[2]) - parseInt(viewBox[0])
    var height = parseInt(viewBox[3]) - parseInt(viewBox[1])
    var midx = (width) / 2
    var midy = (height) / 2
    var $path = layer.$shape.children('path, text')
    var attr = {
      fill: layer.fillColor,
      stroke: layer.strokeColor,
      'stroke-width': layer.strokeWidth,
      'stroke-dasharray': layer.strokeStyle,
      transform: 
        'translate(' + layer.dx + ', ' + layer.dy + ') ' + 
        'rotate(' + layer.rotation + ', ' + midx + ', ' + midy + ') ' +
        'translate(' + ((1 - layer.scale) * midx) + ', ' + ((1 - layer.scale) * midy) + ') ' + 
        'scale(' + layer.scale + ') '
    }
    if (layer.isText) {
      attr['font-size'] = layer.fontSize
      attr['font-family'] = layer.fontFamily
      attr['font-weight'] = layer.fontWeight
      attr['letter-spacing'] = layer.letterSpacing
    }
    $path.attr(attr)
    layer.update_cache(complete)
  }

  BadgeLayer.prototype.update_cache = function (complete) {
    // update img cache of svg
    var layer = this
    layer.img.onload = function () {
      if (complete) {
        complete(layer)
      }
    }
    var serializer = new XMLSerializer();
    // people might be using the svg elsewhere and have changed its size
    // so lets save its size, resize it to canvas size and then put it back
    // they shouldn't really be using it directly - but we'll let them off
    var width = layer.$shape.width()
    var height = layer.$shape.height()
    layer.$shape.width(layer.img.width)
    layer.$shape.height(layer.img.height)
    var layerSVG = serializer.serializeToString(layer.$shape[0]);
    layer.layerSVG = layerSVG
    layer.$shape.width(width)
    layer.$shape.height(height)
    layer.img.src = "data:image/svg+xml," + encodeURIComponent(layerSVG)    
  }



  Badge = function (settings, badgeSize, canvasSelector, complete) {
    var badge = this
    badge.name = settings.name
    badge.$canvas = $(canvasSelector)
    badge.badgeSize = badgeSize
    badge.layers = []
    if (settings.layers) {
      var count = 0
      $.each(settings.layers, function (idx, layer) {
        badge.layers.push(new BadgeLayer(badge, layer, function (badgeLayer) {
          count++
          if (settings.layers.length == count) {
            // everything is loaded
            badge.render()
            if (complete) {
              complete(badge)
            }
          }
        }))
      })

      if (settings.layers.length == 0) {
        if (complete) {
          complete(badge)
        }
      }
    } else {
      if (complete) {
        complete(badge)
      }      
    }
  }

  Badge.prototype.settings = function () {
    var badge = this
    var settings = {
      name: badge.name,
      layers: []
    }
    $.each(badge.layers, function (idx, badgeLayer) {
      settings.layers.push(badgeLayer.settings())
    })
    return settings
  }

  Badge.prototype.add = function (settings, complete) {
    var badge = this
    new BadgeLayer(badge, settings, function (badgeLayer) {
      badge.layers.push(badgeLayer)
      badge.render()
      complete(badgeLayer)
    })
  }

  Badge.prototype.remove = function (targetBadgeLayer) {
    var badge = this
    $.each(badge.layers, function (idx, badgeLayer) {
      if (targetBadgeLayer == badgeLayer) {
        badge.layers.splice(idx, 1)
        return false
      }
    })
    badge.render()
  }

  Badge.prototype.reorder = function (badgeLayers) {
    var badge = this
    badge.layers = badgeLayers
    badge.render()
  }

  Badge.prototype.render = function () {
    var badge = this
    var ctx = badge.$canvas[0].getContext('2d')
    ctx.clearRect(0, 0, badge.$canvas.width(), badge.$canvas.height());
    $.each(badge.layers, function (idx, badgeLayer) {
      ctx.drawImage(badgeLayer.img, 0, 0, badge.$canvas.width(), badge.$canvas.height())
    })
  }
}( jQuery ))
