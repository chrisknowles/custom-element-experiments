/**
 * A wrapper module for snabbdom to give it a simpler
 * syntax for creating elements
 */
import {init}   from 'snabbdom';
import sh       from 'snabbdom/h';
import c        from 'snabbdom/modules/class';
import attrs    from 'snabbdom/modules/attributes';
import dataset  from 'snabbdom/modules/dataset';
import props    from 'snabbdom/modules/props';
import style    from 'snabbdom/modules/style';
import events   from 'snabbdom/modules/eventlisteners';
import hero     from 'snabbdom/modules/hero';

const SnabbdomPatch = init([c, dataset, props, attrs, events, style]);

const h = tag => (a, b, c) => {
  if (c) {
    return sh(tag + a, b, c);
  } else if (b) {
    // possible scenarios:
    // selectors, params | params, text   | selectors, text
    // string,    object | object, string | string,    string
    if (typeof a === 'string' && typeof b === 'object') {
      if (isProps(b)) {
        return sh(tag + a, b, '');
      } else {
        return sh(tag + a, {}, b);
      }
    } else if (typeof a === 'object' && typeof b === 'string') {
      return sh(tag, a, b);
    } else if (typeof a === 'object' && typeof b === 'object') {
      return sh(tag, a, b);
    } else {
      return sh(tag+ a, {}, b);
    }
  } else {
    // possible scenarios:
    // selectors | params | text
    // string    | object | string
    if (typeof a === 'object') {
      if (isProps(a)) {
        return sh(tag, a, '');
      } else {
        return sh(tag, {}, a);
      }
    } else if (a && a.match && a.match(/^[\.#]+/)) {
      return sh(tag + a, {}, '');
    } else {
      return sh(tag, {}, a);
    }
  }
};

const isProps = obj =>
  obj.class   ||
  obj.attrs   ||
  obj.props   ||
  obj.dataset ||
  obj.style   ||
  obj.on;

export const ol       = h('ol');
export const ul       = h('ul');
export const li       = h('li');
export const table    = h('table');
export const tr       = h('tr');
export const td       = h('td');
export const tbody    = h('tbody');
export const tfoot    = h('tfoot');
export const thead    = h('thead');
export const div      = h('div');
export const p        = h('p');
export const span     = h('span');
export const h1       = h('h1');
export const h2       = h('h2');
export const h3       = h('h3');
export const h4       = h('h4');
export const h5       = h('h5');
export const h6       = h('h6');
export const a        = h('a');
export const input    = h('input');
export const button   = h('button');
export const textarea = h('textarea');
export const em       = h('em');
export const i        = h('i');
export const label    = h('label');
export const article  = h('article');
export const section  = h('section');
export const img      = h('img');
export const strong   = h('strong');
export const header   = h('header');
export const footer   = h('footer');
export const main     = h('main');
export const abbr     = h('abbr');
export const code     = h('code');
export const slot     = h('slot');
export const select   = h('select');
export const option   = h('option');

export {SnabbdomPatch, h};
