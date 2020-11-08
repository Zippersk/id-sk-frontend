import '../../../govuk/vendor/polyfills/Function/prototype/bind'
import '../../../govuk/vendor/polyfills/Event' // addEventListener and event.target normaliziation
import { nodeListForEach } from '../../../govuk/common'
import { toggleClass } from '../../common'

/**
 * Header for extended websites
 */
function HeaderExtended($module) {
    this.$module = $module;
}

HeaderExtended.prototype.init = function () {

    let $module = this.$module;
    // check for module
    if (!$module) {
        return;
    }

    // check for search component
    let $toggleSearchComponent = $module.querySelector('.idsk-header-extended__search');
    let $toggleSearchInputComponent = $module.querySelector('.idsk-header-extended__search-form input');
    if ($toggleSearchComponent && $toggleSearchInputComponent) {
        // Handle $toggleSearchComponent click and blur events
        $toggleSearchComponent.addEventListener('focus', this.handleSearchComponentClick.bind(this));
        // both blur events needed
        // if form is shown, but has not been focused, inputs blur won't be fired, then trigger this one
        $toggleSearchComponent.addEventListener('blur', this.handleSearchComponentClick.bind(this));
        // if form is shown, and has been focused, trigger this one
        $toggleSearchInputComponent.addEventListener('blur', this.handleSearchComponentClick.bind(this));
    }

    // check for language selector
    let $toggleLanguageSelector = $module.querySelector('.idsk-js-header-extended-language-toggle');
    if ($toggleLanguageSelector) {
        // Handle $toggleLanguageSelect click events
        $toggleLanguageSelector.addEventListener('focus', this.handleLanguageSelectorClick.bind(this));
        $toggleLanguageSelector.addEventListener('blur', this.handleLanguageSelectorClick.bind(this));
    }

    // check for submenu
    let $toggleSubmenus = $module.querySelectorAll('.idsk-header-extended__link');
    if ($toggleSubmenus) {
        let $self = this;
        // Handle $toggleSubmenu click events
        nodeListForEach($toggleSubmenus, function ($toggleSubmenu) {
            $toggleSubmenu.addEventListener('focus', $self.handleSubmenuClick.bind($self));
            $toggleSubmenu.addEventListener('blur', $self.handleSubmenuClick.bind($self));
        })
    }

    // check for menu button and x-mark button
    let $hamburgerMenuButton = $module.querySelector('.idsk-js-header-extended-side-menu');
    let $xMarkMenuButton = $module.querySelector('.idsk-header-extended-x-mark');
    if ($hamburgerMenuButton && $xMarkMenuButton) {
        $hamburgerMenuButton.addEventListener('click', this.handleMobilMenu.bind(this));
        $xMarkMenuButton.addEventListener('click', this.handleMobilMenu.bind(this));
    }

    window.addEventListener('scroll', this.scrollFunction.bind(this));
}

/**
 * Handle focus/blur on search component - show/hide search form, hide/show search text wrapper
 * @param {object} e 
 */
HeaderExtended.prototype.handleSearchComponentClick = function (e) {
    let $el = e.target || e.srcElement;
    let $target = $el.closest('.idsk-header-extended__search');
    let $relatedTarget = e.relatedTarget ? (e.relatedTarget).closest('.idsk-header-extended__search-form') : e.relatedTarget;
    let $searchText = $target.querySelector('.idsk-header-extended__search-text');
    let $searchForm = $target.querySelector('.idsk-header-extended__search-form');
    if ($searchText && $searchForm) {
        if (e.type === 'focus') {
            $searchText.classList.add('--hide');
            $searchForm.classList.add('--show');
        } else if (e.type === 'blur' && $relatedTarget !== $searchForm) {
            $searchText.classList.remove('--hide');
            $searchForm.classList.remove('--show');
        }
    }
}

/**
 * Handle open/hide language switcher
 * @param {object} e 
 */
HeaderExtended.prototype.handleLanguageSelectorClick = function (e) {
    let $toggleButton = e.target || e.srcElement;
    let $target = $toggleButton.closest('.idsk-header-extended__language');
    toggleClass($target, 'idsk-header-extended__language--active');
}

/**
 * Handle open/hide submenu
 * @param {object} e 
 */
HeaderExtended.prototype.handleSubmenuClick = function (e) {
    let $srcEl = e.target || e.srcElement;
    let $toggleButton = $srcEl.closest('.idsk-header-extended__navigation-item');
    toggleClass($toggleButton, 'idsk-header-extended__navigation-item--active');
    let $target = $toggleButton
        .closest('.idsk-header-extended__navigation-item')
        .querySelector('.idsk-header-extended__navigation-submenu');
    toggleClass($target, '--open');
}

/**
 * Show/hide mobil menu
 * @param {object} e
 */
HeaderExtended.prototype.handleMobilMenu = function (e) {
    let $mobilMenu = this.$module.querySelector('.idsk-header-extended-overlay');
    let $logo = this.$module.querySelector('.idsk-header-extended__logo');
    let $xMark = this.$module.querySelector('.idsk-header-extended-x-mark')
    let $searchBar = this.$module.querySelector('.idsk-header-extended__search');
    let $languageBar = this.$module.querySelector('.idsk-header-extended__language');
    let $socialBar = this.$module.querySelector('.idsk-header-extended__social');
    let $navigation = this.$module.querySelector('.idsk-header-extended__navigation');

    toggleClass($mobilMenu, "--open");
    toggleClass($logo, "--show-mobile");
    toggleClass($xMark, "--show-mobile");
    toggleClass($searchBar, "--show-mobile");
    toggleClass($languageBar, "--show-mobile");
    toggleClass($socialBar, "--show-mobile");
    toggleClass($navigation, "--show-mobile");
}

/**
 * When the user scrolls down from the top of the document, resize the navbar's padding and the logo
 */
HeaderExtended.prototype.scrollFunction = function () {
    let $module = this.$module;
    let $headerComputedStyle = getComputedStyle($module);
    let $headerPosition = $headerComputedStyle.getPropertyValue('position');
    // skip if it's not a mobile view
    if (['sticky', 'fixed'].indexOf($headerPosition) < 0) {
        return;
    }

    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        $module.classList.add('--shrink');
    } else if (document.body.scrollTop < 10 && document.documentElement.scrollTop < 10) {
        $module.classList.remove('--shrink');
    }
}

export default HeaderExtended