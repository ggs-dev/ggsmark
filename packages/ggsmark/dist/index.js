"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _unified = _interopRequireDefault(require("unified"));

var _remarkParse = _interopRequireDefault(require("remark-parse"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _github = _interopRequireDefault(require("hast-util-sanitize/lib/github"));

var _rehypeSanitize = _interopRequireDefault(require("rehype-sanitize"));

require("core-js");

var _remarkIframes = _interopRequireDefault(require("remark-iframes"));

var _remarkTextAlignment = _interopRequireDefault(require("remark-text-alignment"));

var _remarkColorText = _interopRequireDefault(require("remark-color-text"));

var _remarkSpoilers = _interopRequireDefault(require("remark-spoilers"));

var _rehypeStringify = _interopRequireDefault(require("rehype-stringify"));

var _remarkRehype = _interopRequireDefault(require("remark-rehype"));

require("regenerator-runtime/runtime");

// Plugins
// Don't use remark-html otherwise we can't customize HTML
// Import this since remark-iframe needs it
var _default = text => {
  var schema = (0, _deepmerge.default)(_github.default, {
    attributes: {
      '*': ['allowfullscreen', 'frameborder', 'src', 'className', 'style', 'width', 'height']
    },
    tagNames: ['iframe']
  });
  return (0, _unified.default)().use(_remarkParse.default, {
    blocks: []
  }).use(_remarkIframes.default, {
    'www.youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [['watch?v=', 'embed/'], ['http://', 'https://']],
      thumbnail: {
        format: 'http://img.youtube.com/vi/{id}/0.jpg',
        id: '.+/(.+)$'
      },
      removeAfter: '&'
    },
    'youtu.be': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [['watch?v=', 'embed/'], ['http://', 'https://']],
      thumbnail: {
        format: 'http://img.youtube.com/vi/{id}/0.jpg',
        id: '.+/(.+)$'
      },
      removeAfter: '&'
    },
    'soundcloud.com': {
      tag: 'iframe',
      width: '100%',
      height: 150,
      disabled: false,
      replace: [['soundcloud.com/', 'w.soundcloud.com/player/?visual=true&url=https://soundcloud.com/'], ['http://', 'https://']]
    }
  }).use(_remarkTextAlignment.default).use(_remarkRehype.default).use(_rehypeStringify.default).use(_remarkColorText.default).use(_remarkSpoilers.default).use(_rehypeSanitize.default, schema).processSync(text).toString();
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0ZXh0Iiwic2NoZW1hIiwiZ2giLCJhdHRyaWJ1dGVzIiwidGFnTmFtZXMiLCJ1c2UiLCJtYXJrZG93biIsImJsb2NrcyIsImlmcmFtZSIsInRhZyIsIndpZHRoIiwiaGVpZ2h0IiwiZGlzYWJsZWQiLCJyZXBsYWNlIiwidGh1bWJuYWlsIiwiZm9ybWF0IiwiaWQiLCJyZW1vdmVBZnRlciIsImFsaWduIiwicmVoeXBlIiwic3RyaW5naWZ5IiwiY29sb3IiLCJzcG9pbGVycyIsInNhbml0aXplIiwicHJvY2Vzc1N5bmMiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBR0E7O0FBWEE7QUFNQTtBQUlBO2VBR2dCQSxJQUFELElBQVU7QUFDdkIsTUFBSUMsTUFBTSxHQUFHLHdCQUFNQyxlQUFOLEVBQVU7QUFDckJDLElBQUFBLFVBQVUsRUFBRTtBQUNWLFdBQUssQ0FDSCxpQkFERyxFQUVILGFBRkcsRUFHSCxLQUhHLEVBSUgsV0FKRyxFQUtILE9BTEcsRUFNSCxPQU5HLEVBT0gsUUFQRztBQURLLEtBRFM7QUFZckJDLElBQUFBLFFBQVEsRUFBRSxDQUFDLFFBQUQ7QUFaVyxHQUFWLENBQWI7QUFlQSxTQUFPLHdCQUNKQyxHQURJLENBQ0FDLG9CQURBLEVBQ1U7QUFDYkMsSUFBQUEsTUFBTSxFQUFFO0FBREssR0FEVixFQUlKRixHQUpJLENBSUFHLHNCQUpBLEVBSVE7QUFDWCx1QkFBbUI7QUFDakJDLE1BQUFBLEdBQUcsRUFBRSxRQURZO0FBRWpCQyxNQUFBQSxLQUFLLEVBQUUsR0FGVTtBQUdqQkMsTUFBQUEsTUFBTSxFQUFFLEdBSFM7QUFJakJDLE1BQUFBLFFBQVEsRUFBRSxLQUpPO0FBS2pCQyxNQUFBQSxPQUFPLEVBQUUsQ0FDUCxDQUFDLFVBQUQsRUFBYSxRQUFiLENBRE8sRUFFUCxDQUFDLFNBQUQsRUFBWSxVQUFaLENBRk8sQ0FMUTtBQVNqQkMsTUFBQUEsU0FBUyxFQUFFO0FBQ1RDLFFBQUFBLE1BQU0sRUFBRSxzQ0FEQztBQUVUQyxRQUFBQSxFQUFFLEVBQUU7QUFGSyxPQVRNO0FBYWpCQyxNQUFBQSxXQUFXLEVBQUU7QUFiSSxLQURSO0FBZ0JYLGdCQUFZO0FBQ1ZSLE1BQUFBLEdBQUcsRUFBRSxRQURLO0FBRVZDLE1BQUFBLEtBQUssRUFBRSxHQUZHO0FBR1ZDLE1BQUFBLE1BQU0sRUFBRSxHQUhFO0FBSVZDLE1BQUFBLFFBQVEsRUFBRSxLQUpBO0FBS1ZDLE1BQUFBLE9BQU8sRUFBRSxDQUNQLENBQUMsVUFBRCxFQUFhLFFBQWIsQ0FETyxFQUVQLENBQUMsU0FBRCxFQUFZLFVBQVosQ0FGTyxDQUxDO0FBU1ZDLE1BQUFBLFNBQVMsRUFBRTtBQUNUQyxRQUFBQSxNQUFNLEVBQUUsc0NBREM7QUFFVEMsUUFBQUEsRUFBRSxFQUFFO0FBRkssT0FURDtBQWFWQyxNQUFBQSxXQUFXLEVBQUU7QUFiSCxLQWhCRDtBQStCWCxzQkFBa0I7QUFDaEJSLE1BQUFBLEdBQUcsRUFBRSxRQURXO0FBRWhCQyxNQUFBQSxLQUFLLEVBQUUsTUFGUztBQUdoQkMsTUFBQUEsTUFBTSxFQUFFLEdBSFE7QUFJaEJDLE1BQUFBLFFBQVEsRUFBRSxLQUpNO0FBS2hCQyxNQUFBQSxPQUFPLEVBQUUsQ0FDUCxDQUNFLGlCQURGLEVBRUUsa0VBRkYsQ0FETyxFQUtQLENBQUMsU0FBRCxFQUFZLFVBQVosQ0FMTztBQUxPO0FBL0JQLEdBSlIsRUFpREpSLEdBakRJLENBaURBYSw0QkFqREEsRUFrREpiLEdBbERJLENBa0RBYyxxQkFsREEsRUFtREpkLEdBbkRJLENBbURBZSx3QkFuREEsRUFvREpmLEdBcERJLENBb0RBZ0Isd0JBcERBLEVBcURKaEIsR0FyREksQ0FxREFpQix1QkFyREEsRUFzREpqQixHQXRESSxDQXNEQWtCLHVCQXREQSxFQXNEVXRCLE1BdERWLEVBdURKdUIsV0F2REksQ0F1RFF4QixJQXZEUixFQXdESnlCLFFBeERJLEVBQVA7QUF5REQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1bmlmaWVkIGZyb20gJ3VuaWZpZWQnXHJcbmltcG9ydCBtYXJrZG93biBmcm9tICdyZW1hcmstcGFyc2UnXHJcbmltcG9ydCBtZXJnZSBmcm9tICdkZWVwbWVyZ2UnXHJcbmltcG9ydCBnaCBmcm9tICdoYXN0LXV0aWwtc2FuaXRpemUvbGliL2dpdGh1YidcclxuaW1wb3J0IHNhbml0aXplIGZyb20gJ3JlaHlwZS1zYW5pdGl6ZSdcclxuaW1wb3J0ICdjb3JlLWpzJ1xyXG5cclxuLy8gUGx1Z2luc1xyXG5pbXBvcnQgaWZyYW1lIGZyb20gJ3JlbWFyay1pZnJhbWVzJ1xyXG5pbXBvcnQgYWxpZ24gZnJvbSAncmVtYXJrLXRleHQtYWxpZ25tZW50J1xyXG5pbXBvcnQgY29sb3IgZnJvbSAncmVtYXJrLWNvbG9yLXRleHQnXHJcbmltcG9ydCBzcG9pbGVycyBmcm9tICdyZW1hcmstc3BvaWxlcnMnXHJcblxyXG4vLyBEb24ndCB1c2UgcmVtYXJrLWh0bWwgb3RoZXJ3aXNlIHdlIGNhbid0IGN1c3RvbWl6ZSBIVE1MXHJcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAncmVoeXBlLXN0cmluZ2lmeSdcclxuaW1wb3J0IHJlaHlwZSBmcm9tICdyZW1hcmstcmVoeXBlJ1xyXG5cclxuLy8gSW1wb3J0IHRoaXMgc2luY2UgcmVtYXJrLWlmcmFtZSBuZWVkcyBpdFxyXG5pbXBvcnQgJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh0ZXh0KSA9PiB7XHJcbiAgbGV0IHNjaGVtYSA9IG1lcmdlKGdoLCB7XHJcbiAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICcqJzogW1xyXG4gICAgICAgICdhbGxvd2Z1bGxzY3JlZW4nLFxyXG4gICAgICAgICdmcmFtZWJvcmRlcicsXHJcbiAgICAgICAgJ3NyYycsXHJcbiAgICAgICAgJ2NsYXNzTmFtZScsXHJcbiAgICAgICAgJ3N0eWxlJyxcclxuICAgICAgICAnd2lkdGgnLFxyXG4gICAgICAgICdoZWlnaHQnXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB0YWdOYW1lczogWydpZnJhbWUnXVxyXG4gIH0pXHJcblxyXG4gIHJldHVybiB1bmlmaWVkKClcclxuICAgIC51c2UobWFya2Rvd24sIHtcclxuICAgICAgYmxvY2tzOiBbXVxyXG4gICAgfSlcclxuICAgIC51c2UoaWZyYW1lLCB7XHJcbiAgICAgICd3d3cueW91dHViZS5jb20nOiB7XHJcbiAgICAgICAgdGFnOiAnaWZyYW1lJyxcclxuICAgICAgICB3aWR0aDogNTYwLFxyXG4gICAgICAgIGhlaWdodDogMzE1LFxyXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcclxuICAgICAgICByZXBsYWNlOiBbXHJcbiAgICAgICAgICBbJ3dhdGNoP3Y9JywgJ2VtYmVkLyddLFxyXG4gICAgICAgICAgWydodHRwOi8vJywgJ2h0dHBzOi8vJ11cclxuICAgICAgICBdLFxyXG4gICAgICAgIHRodW1ibmFpbDoge1xyXG4gICAgICAgICAgZm9ybWF0OiAnaHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS97aWR9LzAuanBnJyxcclxuICAgICAgICAgIGlkOiAnLisvKC4rKSQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVBZnRlcjogJyYnXHJcbiAgICAgIH0sXHJcbiAgICAgICd5b3V0dS5iZSc6IHtcclxuICAgICAgICB0YWc6ICdpZnJhbWUnLFxyXG4gICAgICAgIHdpZHRoOiA1NjAsXHJcbiAgICAgICAgaGVpZ2h0OiAzMTUsXHJcbiAgICAgICAgZGlzYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgIHJlcGxhY2U6IFtcclxuICAgICAgICAgIFsnd2F0Y2g/dj0nLCAnZW1iZWQvJ10sXHJcbiAgICAgICAgICBbJ2h0dHA6Ly8nLCAnaHR0cHM6Ly8nXVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgdGh1bWJuYWlsOiB7XHJcbiAgICAgICAgICBmb3JtYXQ6ICdodHRwOi8vaW1nLnlvdXR1YmUuY29tL3ZpL3tpZH0vMC5qcGcnLFxyXG4gICAgICAgICAgaWQ6ICcuKy8oLispJCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZUFmdGVyOiAnJidcclxuICAgICAgfSxcclxuICAgICAgJ3NvdW5kY2xvdWQuY29tJzoge1xyXG4gICAgICAgIHRhZzogJ2lmcmFtZScsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICBoZWlnaHQ6IDE1MCxcclxuICAgICAgICBkaXNhYmxlZDogZmFsc2UsXHJcbiAgICAgICAgcmVwbGFjZTogW1xyXG4gICAgICAgICAgW1xyXG4gICAgICAgICAgICAnc291bmRjbG91ZC5jb20vJyxcclxuICAgICAgICAgICAgJ3cuc291bmRjbG91ZC5jb20vcGxheWVyLz92aXN1YWw9dHJ1ZSZ1cmw9aHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS8nXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgWydodHRwOi8vJywgJ2h0dHBzOi8vJ11cclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAudXNlKGFsaWduKVxyXG4gICAgLnVzZShyZWh5cGUpXHJcbiAgICAudXNlKHN0cmluZ2lmeSlcclxuICAgIC51c2UoY29sb3IpXHJcbiAgICAudXNlKHNwb2lsZXJzKVxyXG4gICAgLnVzZShzYW5pdGl6ZSwgc2NoZW1hKVxyXG4gICAgLnByb2Nlc3NTeW5jKHRleHQpXHJcbiAgICAudG9TdHJpbmcoKVxyXG59XHJcbiJdfQ==