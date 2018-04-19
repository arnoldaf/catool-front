import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AsideNavService } from '../../../_services/aside-nav.service';

declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {

    public asideNavMenus: any[];
    constructor(private asideNavService: AsideNavService) {

    }
    ngOnInit() {
        this.getAsideNav();
    }

    getAsideNav(): void {
        this.asideNavService.getAsideNav()
            .subscribe(asideNavMenus => this.asideNavMenus = asideNavMenus);
    }
    ngAfterViewInit() {

        mLayout.initAside();

    }

}
