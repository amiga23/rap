/*******************************************************************************
 * Copyright (c) 2009, 2015 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.swt.internal.widgets.treekit;

import org.eclipse.rap.rwt.internal.theme.CssBoxDimensions;
import org.eclipse.rap.rwt.internal.theme.Size;
import org.eclipse.swt.graphics.Font;
import org.eclipse.swt.internal.widgets.controlkit.ControlThemeAdapterImpl;
import org.eclipse.swt.widgets.Control;


public class TreeThemeAdapter extends ControlThemeAdapterImpl {

  public CssBoxDimensions getCheckBoxMargin( Control control ) {
    return getCssBoxDimensions( "Tree-Checkbox", "margin", control );
  }

  public Size getCheckBoxImageSize( Control control ) {
    return getCssImageSize( "Tree-Checkbox", "background-image", control );
  }

  public CssBoxDimensions getCellPadding( Control control ) {
    return getCssBoxDimensions( "Tree-Cell", "padding", control );
  }

  public int getCellSpacing( Control control ) {
    return Math.max( 0, getCssDimension( "Tree-Cell", "spacing", control ) );
  }

  public int getHeaderBorderBottomWidth( Control control ) {
    return getCssBorderWidth( "TreeColumn", "border-bottom", control );
  }

  public CssBoxDimensions getHeaderPadding( Control control ) {
    return getCssBoxDimensions( "TreeColumn", "padding", control );
  }

  public Font getHeaderFont( Control control ) {
    return getCssFont( "TreeColumn", "font", control );
  }

  public int getIndentionWidth( Control control ) {
    return getCssDimension( "Tree-Indent", "width", control );
  }

}
