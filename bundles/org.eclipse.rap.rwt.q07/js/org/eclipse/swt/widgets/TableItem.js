/*******************************************************************************
 * Copyright (c) 2007, 2009 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 ******************************************************************************/

/**
 * This class provides the client-side counterpart for 
 * org.eclipse.swt.widgets.TableItem.
 */
qx.Class.define( "org.eclipse.swt.widgets.TableItem", {
  extend : qx.core.Object,

  construct : function( parent, index ) {
    this.base( arguments );
    this._parent = parent;
    this._cached = true;
    this._checked = false;
    this._grayed = false;
    this._texts = new Array();
    this._images = new Array();
    this._fonts = null;
    this._backgrounds = null;
    this._foregrounds = null;
    // HACK: Table needs one 'emptyItem' (draws the remaining space that is not 
    //       occupied by actual items) and a 'virtualItem' (represents a not
    //       yet resolved items) 
    // Those have an index of -1
    if ( index >= 0 ) {
      parent._addItem( this, index );
    }
  },
  
  destruct : function() {
    // When changing this, re-check destructor of Table.js as well as TableLCA
    // and TableItemLCA 
    if( !this._parent.getDisposed() ) {
      this._parent._removeItem( this );
    }
    org.eclipse.swt.WidgetManager.getInstance().remove( this );
  },

  statics : {
    // Constants used to produce markup that holds the item image
    IMG_START : "<div ",
    IMG_STYLE_OPEN : "style=\"position:absolute;overflow:hidden;",
    IMG_STYLE_CLOSE : "\"",
    IMG_CLOSE : ">",
    IMG_SRC_OPEN : "<img src=\"",
    IMG_SRC_CLOSE : "\" />",
    IMG_END : "</div>",
    
    // Constants used to produce markup that holds the item text
    TEXT_OPEN : "<div ",
    TEXT_STYLE_OPEN : "style=\"position:absolute;overflow:hidden;vertical-align:middle;white-space:nowrap;",
    TEXT_STYLE_CLOSE : "\"",
    TEXT_CLOSE : ">",
    TEXT_END : "</div>",

    // TODO [rh] make border color themeable
    LINE_BORDER : "border-left:1px solid #d0d0d0;",
    PADDING_IMAGE : "padding-left:1px;",
    PADDING_TEXT : "padding-left:2px;",

    TOP : "top:",
    LEFT : "left:",
    WIDTH : "width:",
    HEIGHT : "height:",
    PX : "px;",
    
    TEXT_ALIGN : "text-align:",
    FONT : "font:",
    BACKGROUND : "background-color:",
    FOREGROUND : "color:",
    
    STRING_BUILDER : new Array()
  },
  
  members : {

    getCached : function() {
      return this._cached;
    },
    
    setChecked : function( value ) {
      if( this._checked != value ) {
        this._checked = value;
      }
    },
    
    getChecked : function() {
      return this._checked;
    },
    
    setGrayed : function( value ) {
      if( this._grayed != value ) {
        this._grayed = value;
      }
    },
    
    getGrayed : function() {
      return this._grayed;
    },
    
    setSelection : function( value ) {
      // TODO [rh] improve this: don't access internal structures of Table
      var index = this._getIndex();
      if( value ) {
        this._parent._selectItem( index, false );
        // reset selection start index when selection changes server-side
        this._parent._resetSelectionStart();
      } else {
        this._parent._deselectItem( index, false );
      }
    },
    
    setTexts : function( texts ) {
      this._texts = texts;
    },
    
    setImages : function( images ) {
      this._images = images;
    },
    
    setFonts : function( fonts ) {
      this._fonts = fonts;
    },
    
    setBackgrounds : function( backgrounds ) {
      this._backgrounds = backgrounds;
    },
    
    setForegrounds : function( foregrounds ) {
      this._foregrounds = foregrounds;
    },
    
    update : function() {
      this._cached = true;
      this._parent.updateItem( this._getIndex(), true );
    },
    
    clear : function() {
      this._cached = false;
      this._checked = false;
      this._grayed = false;
      this._texts = new Array();
      this._images = new Array();
      this._fonts = null;
      this._backgrounds = null;
      this._foregrounds = null;
    },
    
    /**
     * Called by Table when updating visible rows to obtain HTML markup that 
     * represents the item.
     */
    _getMarkup : function() {
      var parent = this._parent;
      var markup = new Array();
      var left = 0;
      var width = 0;
      var columnCount = parent.getColumnCount();
      if( columnCount == 0 ) {
        columnCount = 1;
      } 
      var leftOffset = 0;
      if( parent.hasCheckBoxes() ) {
        leftOffset = org.eclipse.swt.widgets.Table.CHECK_WIDTH;
      }
      var font = "";
      var foreground = "";
      var background = "";
      var parentForeground = "";
      if( !qx.util.ColorUtil.isThemedColor( parent.getTextColor() ) ) {
        parentForeground
          = org.eclipse.swt.widgets.TableItem.FOREGROUND 
          + parent.getTextColor()
          + ";";
      }
      for( var i = 0; i < columnCount; i++ ) {
        // Font
        if( this._fonts && this._fonts[ i ] ) {
          font
            = org.eclipse.swt.widgets.TableItem.FONT 
            + this._fonts[ i ] 
            + ";";
        }
        // Foreground and background color
        if( parent.getEnabled() && !parent._isItemSelected( this._getIndex() ) )
        {
          if( this._foregrounds && this._foregrounds[ i ] ) {
            foreground
              = org.eclipse.swt.widgets.TableItem.FOREGROUND 
              + this._foregrounds[ i ] 
              + ";";
          } else {
            foreground = parentForeground;
          }
          if( this._backgrounds && this._backgrounds[ i ] ) {
            background 
              = org.eclipse.swt.widgets.TableItem.BACKGROUND 
              + this._backgrounds[ i ] 
              + ";";
          }
        }
        var isEmpty = this._getIndex() == -1;
        var columnHasImage = parent.getItemImageWidth( i ) > 0;
        var showLine = this._parent.getLinesVisible() && i > 0;
        var showImage = !isEmpty && columnHasImage;
        // Draw image
        if( showImage ) {
          left = parent.getItemImageLeft( i );
          width = parent.getItemImageWidth( i );
          var image = this._images == null ? null : this._images[ i ];
          markup.push( this._getImageMarkup( image, left, width, background, showLine ) );
          showLine = false;
        }
        // Draw text
        if( this._texts[ i ] !== undefined ) {
          left = parent.getItemTextLeft( i );
          width = parent.getItemTextWidth( i );
          var align = qx.constant.Layout.ALIGN_LEFT;
          var column = parent.getColumn( i );
          if( column ) {
            align = column.getHorizontalChildrenAlign();
          }
          markup.push( this._getTextMarkup( this._texts[ i ], left, width, align, font, foreground, background, showLine, showImage ) );
        }
      }
      return markup.join( "" );
    },

    _getImageMarkup : function( image, left, width, background, showLine ) {
      var result = "";
      if( image != null || showLine ) {
        var buffer = org.eclipse.swt.widgets.TableItem.STRING_BUILDER;
        buffer.length = 0;
        // TODO [rh] replace div/img markup with only a div with a bg-image
        buffer.push( org.eclipse.swt.widgets.TableItem.IMG_START );
        buffer.push( org.eclipse.swt.widgets.TableItem.IMG_STYLE_OPEN );
        if( showLine ) {
          buffer.push( org.eclipse.swt.widgets.TableItem.LINE_BORDER );
        }
        buffer.push( org.eclipse.swt.widgets.TableItem.PADDING_IMAGE );
        buffer.push( org.eclipse.swt.widgets.TableItem.TOP );
        buffer.push( "0" ); 
        buffer.push( org.eclipse.swt.widgets.TableItem.PX ); 
        buffer.push( org.eclipse.swt.widgets.TableItem.LEFT );
        buffer.push( left );
        buffer.push( org.eclipse.swt.widgets.TableItem.PX ); 
        buffer.push( org.eclipse.swt.widgets.TableItem.WIDTH );
        buffer.push( width );
        buffer.push( org.eclipse.swt.widgets.TableItem.PX ); 
        buffer.push( org.eclipse.swt.widgets.TableItem.HEIGHT );
        buffer.push( this._parent.getItemHeight() );
        buffer.push( org.eclipse.swt.widgets.TableItem.PX );
        buffer.push( background );
        buffer.push( org.eclipse.swt.widgets.TableItem.IMG_STYLE_CLOSE );
        buffer.push( org.eclipse.swt.widgets.TableItem.IMG_CLOSE );
        if( image != null ) {
          buffer.push( org.eclipse.swt.widgets.TableItem.IMG_SRC_OPEN );
          buffer.push( image );
          buffer.push( org.eclipse.swt.widgets.TableItem.IMG_SRC_CLOSE );
        }
        buffer.push( org.eclipse.swt.widgets.TableItem.IMG_END );
        result = buffer.join( "" );
      }
      return result;
    },

    _getTextMarkup : function( text, left, width, align, font, foreground, background, showLine, showImage ) {
      var result;
      if( text == "" ) {
        result = "";
      } else {
        var buffer = org.eclipse.swt.widgets.TableItem.STRING_BUILDER;
        buffer.length = 0;
        buffer.push( org.eclipse.swt.widgets.TableItem.TEXT_OPEN );
        buffer.push( org.eclipse.swt.widgets.TableItem.TEXT_STYLE_OPEN );
        if( showLine ) {
          buffer.push( org.eclipse.swt.widgets.TableItem.LINE_BORDER );
        }
        if( !showImage ) {
          buffer.push( org.eclipse.swt.widgets.TableItem.PADDING_TEXT );
        }
        buffer.push( org.eclipse.swt.widgets.TableItem.TOP );
        buffer.push( "0" );
        buffer.push( org.eclipse.swt.widgets.TableItem.PX );
        buffer.push( org.eclipse.swt.widgets.TableItem.LEFT ); 
        buffer.push( left ); 
        buffer.push( org.eclipse.swt.widgets.TableItem.PX ); 
        buffer.push( org.eclipse.swt.widgets.TableItem.WIDTH ); 
        buffer.push( width );
        buffer.push( org.eclipse.swt.widgets.TableItem.PX );
        buffer.push( org.eclipse.swt.widgets.TableItem.HEIGHT ); 
        buffer.push( this._parent.getItemHeight() );
        buffer.push( org.eclipse.swt.widgets.TableItem.PX );
        buffer.push( font );  
        buffer.push( foreground );
        buffer.push( background );
        buffer.push( org.eclipse.swt.widgets.TableItem.TEXT_ALIGN ); 
        buffer.push( align );
        buffer.push( org.eclipse.swt.widgets.TableItem.TEXT_STYLE_CLOSE );
        buffer.push( org.eclipse.swt.widgets.TableItem.TEXT_CLOSE );
        buffer.push( text );
        buffer.push( org.eclipse.swt.widgets.TableItem.TEXT_END );
        result = buffer.join( "" );
      }
      return result;
    },

    _getIndex : function() {
      // TODO [rh] improve this: don't access internal structures of Table
      return this._parent._items.indexOf( this );
    }
  }
});
