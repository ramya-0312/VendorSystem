import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent {
  hoveredVendor: any = null;

  vendors = [
    {
      fullName: 'Michael Scott',
      username: 'michael_scott',
      role: 'Regional Manager',
      profilePic: 'https://randomuser.me/api/portraits/men/11.jpg',
      posts: 428,
      followers: 1243,
      following: 57
    },
    {
      fullName: 'Dwight Schrute',
      username: 'dwight_schrute',
      role: 'Assistant to the Regional Manager',
      profilePic: 'https://randomuser.me/api/portraits/men/12.jpg',
      posts: 310,
      followers: 892,
      following: 21
    },
    {
      fullName: 'Jim Halpert',
      username: 'jim_halpert',
      role: 'Sales Representative',
      profilePic: 'https://randomuser.me/api/portraits/men/13.jpg',
      posts: 150,
      followers: 950,
      following: 60
    }
  ];
}
