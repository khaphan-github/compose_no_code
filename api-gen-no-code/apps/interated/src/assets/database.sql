/*==============================================================*/

/* DBMS name:      PostgreSQL 8                                 */

/* Created on:     25/10/2023 13:00:17                          */

/*==============================================================*/

/*==============================================================*/

/* Table: ChiTietNoiDung                                        */

/*==============================================================*/

create table
    ChiTietNoiDung (
        maNoiDung VARCHAR(20) not null,
        maSo CHAR(10) not null,
        vaiTro VARCHAR(50) null,
        linkBaiTrinhBay VARCHAR(100) null,
        thoiLuongTrinhBay INT4 null,
        qua VARCHAR(200) null,
        ghiChu VARCHAR(200) null,
        constraint PK_CHITIETNOIDUNG primary key (maNoiDung, maSo)
    );

/*==============================================================*/

/* Index: ChiTietNoiDung_PK                                     */

/*==============================================================*/

create unique index ChiTietNoiDung_PK on ChiTietNoiDung (maNoiDung, maSo);

/*==============================================================*/

/* Index: ChiTietNoiDung_FK                                     */

/*==============================================================*/

create index ChiTietNoiDung_FK on ChiTietNoiDung ( maNoiDung );

/*==============================================================*/

/* Index: ChiTietNoiDung2_FK                                    */

/*==============================================================*/

create index ChiTietNoiDung2_FK on ChiTietNoiDung ( maSo );

/*==============================================================*/

/* Table: ChiTietThongBao                                       */

/*==============================================================*/

create table
    ChiTietThongBao (
        maSo CHAR(10) not null,
        maThongBao VARCHAR(20) not null,
        ngayGui DATE null,
        noiDung VARCHAR(1024) null,
        constraint PK_CHITIETTHONGBAO primary key (maSo, maThongBao)
    );

/*==============================================================*/

/* Index: ChiTietThongBao_PK                                    */

/*==============================================================*/

create unique index ChiTietThongBao_PK on ChiTietThongBao (maSo, maThongBao);

/*==============================================================*/

/* Index: ChiTietThongBao_FK                                    */

/*==============================================================*/

create index ChiTietThongBao_FK on ChiTietThongBao ( maSo );

/*==============================================================*/

/* Index: ChiTietThongBao2_FK                                   */

/*==============================================================*/

create index ChiTietThongBao2_FK on ChiTietThongBao ( maThongBao );

/*==============================================================*/

/* Table: ChucVu                                                */

/*==============================================================*/

create table
    ChucVu (
        maChucVu VARCHAR(20) not null,
        tenChucVu VARCHAR(50) null,
        constraint PK_CHUCVU primary key (maChucVu)
    );

/*==============================================================*/

/* Index: ChucVu_PK                                             */

/*==============================================================*/

create unique index ChucVu_PK on ChucVu ( maChucVu );

/*==============================================================*/

/* Table: DSKhachMoiThamDu                                      */

/*==============================================================*/

create table
    DSKhachMoiThamDu (
        maKhachMoi VARCHAR(20) not null,
        maNoiDung VARCHAR(20) not null,
        vaiTro VARCHAR(50) null,
        linkBaiTrinhBay VARCHAR(100) null,
        thoiLuongTrinhBay INT4 null,
        qua VARCHAR(200) null,
        ghiChu VARCHAR(200) null,
        constraint PK_DSKHACHMOITHAMDU primary key (maKhachMoi, maNoiDung)
    );

/*==============================================================*/

/* Index: DSKhachMoiThamDu_PK                                   */

/*==============================================================*/

create unique index DSKhachMoiThamDu_PK on DSKhachMoiThamDu (maKhachMoi, maNoiDung);

/*==============================================================*/

/* Index: DSKhachMoiThamDu_FK                                   */

/*==============================================================*/

create index DSKhachMoiThamDu_FK on DSKhachMoiThamDu ( maKhachMoi );

/*==============================================================*/

/* Index: DSKhachMoiThamDu2_FK                                  */

/*==============================================================*/

create index DSKhachMoiThamDu2_FK on DSKhachMoiThamDu ( maNoiDung );

/*==============================================================*/

/* Table: DSSinhVienDangKy                                      */

/*==============================================================*/

create table
    DSSinhVienDangKy (
        maHoatDong VARCHAR(20) not null,
        maSo CHAR(10) not null,
        ngayDangKy DATE null,
        gioVao DATE null,
        gioRa DATE null,
        constraint PK_DSSINHVIENDANGKY primary key (maHoatDong, maSo)
    );

/*==============================================================*/

/* Index: DSSinhVienDangKy_PK                                   */

/*==============================================================*/

create unique index DSSinhVienDangKy_PK on DSSinhVienDangKy (maHoatDong, maSo);

/*==============================================================*/

/* Index: DSSinhVienDangKy_FK                                   */

/*==============================================================*/

create index DSSinhVienDangKy_FK on DSSinhVienDangKy ( maHoatDong );

/*==============================================================*/

/* Index: DSSinhVienDangKy2_FK                                  */

/*==============================================================*/

create index DSSinhVienDangKy2_FK on DSSinhVienDangKy ( maSo );

/*==============================================================*/

/* Table: HoatDong                                              */

/*==============================================================*/

create table
    HoatDong (
        maHoatDong VARCHAR(20) not null,
        maTieuChi VARCHAR(20) null,
        maLoaiHoatDong VARCHAR(20) null,
        tenHoatDong VARCHAR(200) null,
        thoiGianBatDau DATE null,
        thoiGianKetThuc DATE null,
        diaChi VARCHAR(200) null,
        soLuongSinhVien INT4 null,
        yeuCau VARCHAR(1024) null,
        hinh VARCHAR(100) null,
        trangThai BOOL null,
        moTa VARCHAR(1024) null,
        constraint PK_HOATDONG primary key (maHoatDong)
    );

/*==============================================================*/

/* Index: HoatDong_PK                                           */

/*==============================================================*/

create unique index HoatDong_PK on HoatDong ( maHoatDong );

/*==============================================================*/

/* Index: Relationship_1_FK                                     */

/*==============================================================*/

create index Relationship_1_FK on HoatDong ( maLoaiHoatDong );

/*==============================================================*/

/* Index: Relationship_2_FK                                     */

/*==============================================================*/

create index Relationship_2_FK on HoatDong ( maTieuChi );

/*==============================================================*/

/* Table: KhachMoi                                              */

/*==============================================================*/

create table
    KhachMoi (
        maKhachMoi VARCHAR(20) not null,
        tenKhachMoi VARCHAR(50) null,
        sdt CHAR(10) null,
        diaChi VARCHAR(200) null,
        email VARCHAR(200) null,
        gioiTinh BOOL null,
        ngaySinh DATE null,
        chucVu VARCHAR(20) null,
        hinh VARCHAR(100) null,
        constraint PK_KHACHMOI primary key (maKhachMoi)
    );

/*==============================================================*/

/* Index: KhachMoi_PK                                           */

/*==============================================================*/

create unique index KhachMoi_PK on KhachMoi ( maKhachMoi );

/*==============================================================*/

/* Table: LoaiHoatDong                                          */

/*==============================================================*/

create table
    LoaiHoatDong (
        maLoaiHoatDong VARCHAR(20) not null,
        tenLoaiHoatDong VARCHAR(50) null,
        constraint PK_LOAIHOATDONG primary key (maLoaiHoatDong)
    );

/*==============================================================*/

/* Index: LoaiHoatDong_PK                                       */

/*==============================================================*/

create unique index LoaiHoatDong_PK on LoaiHoatDong (maLoaiHoatDong);

/*==============================================================*/

/* Table: NoiDungToChuc                                         */

/*==============================================================*/

create table
    NoiDungToChuc (
        maNoiDung VARCHAR(20) not null,
        maHoatDong VARCHAR(20) null,
        tenNoiDung VARCHAR(100) null,
        thoiGianBatDau DATE null,
        thoiGianKetThuc DATE null,
        noiDung VARCHAR(1024) null,
        ghiChu VARCHAR(200) null,
        constraint PK_NOIDUNGTOCHUC primary key (maNoiDung)
    );

/*==============================================================*/

/* Index: NoiDungToChuc_PK                                      */

/*==============================================================*/

create unique index NoiDungToChuc_PK on NoiDungToChuc ( maNoiDung );

/*==============================================================*/

/* Index: Relationship_3_FK                                     */

/*==============================================================*/

create index Relationship_3_FK on NoiDungToChuc ( maHoatDong );

/*==============================================================*/

/* Table: PhieuDangKy                                           */

/*==============================================================*/

create table
    PhieuDangKy (
        maPhieu VARCHAR(20) not null,
        maSo CHAR(10) null,
        maHoatDong VARCHAR(20) null,
        tenPhieu VARCHAR(100) null,
        ngayGui DATE null,
        ngayDuyet DATE null,
        trangThai BOOL null,
        ghiChu VARCHAR(200) null,
        constraint PK_PHIEUDANGKY primary key (maPhieu)
    );

/*==============================================================*/

/* Index: PhieuDangKy_PK                                        */

/*==============================================================*/

create unique index PhieuDangKy_PK on PhieuDangKy ( maPhieu );

/*==============================================================*/

/* Index: Relationship_7_FK                                     */

/*==============================================================*/

create index Relationship_7_FK on PhieuDangKy ( maHoatDong );

/*==============================================================*/

/* Index: Relationship_10_FK                                    */

/*==============================================================*/

create index Relationship_10_FK on PhieuDangKy ( maSo );

/*==============================================================*/

/* Table: TaiKhoan                                              */

/*==============================================================*/

create table
    TaiKhoan (
        maSo CHAR(10) not null,
        maChucVu VARCHAR(20) null,
        hoTen VARCHAR(100) null,
        gioiTinh BOOL null,
        ngaySinh DATE null,
        email VARCHAR(200) null,
        sdt CHAR(10) null,
        diaChi VARCHAR(200) null,
        hinh VARCHAR(100) null,
        matKhau VARCHAR(20) null,
        constraint PK_TAIKHOAN primary key (maSo)
    );

/*==============================================================*/

/* Index: TaiKhoan_PK                                           */

/*==============================================================*/

create unique index TaiKhoan_PK on TaiKhoan ( maSo );

/*==============================================================*/

/* Index: Relationship_9_FK                                     */

/*==============================================================*/

create index Relationship_9_FK on TaiKhoan ( maChucVu );

/*==============================================================*/

/* Table: ThongBao                                              */

/*==============================================================*/

create table
    ThongBao (
        maThongBao VARCHAR(20) not null,
        maHoatDong VARCHAR(20) null,
        tenThongBao VARCHAR(100) null,
        noiDung VARCHAR(1024) null,
        constraint PK_THONGBAO primary key (maThongBao)
    );

/*==============================================================*/

/* Index: ThongBao_PK                                           */

/*==============================================================*/

create unique index ThongBao_PK on ThongBao ( maThongBao );

/*==============================================================*/

/* Index: Relationship_8_FK                                     */

/*==============================================================*/

create index Relationship_8_FK on ThongBao ( maHoatDong );

/*==============================================================*/

/* Table: TieuChi                                               */

/*==============================================================*/

create table
    TieuChi (
        maTieuChi VARCHAR(20) not null,
        tenTieuChi VARCHAR(50) null,
        constraint PK_TIEUCHI primary key (maTieuChi)
    );

/*==============================================================*/

/* Index: TieuChi_PK                                            */

/*==============================================================*/

create unique index TieuChi_PK on TieuChi ( maTieuChi );

alter table ChiTietNoiDung
add
    constraint FK_CHITIETN_CHITIETNO_NOIDUNGT foreign key (maNoiDung) references NoiDungToChuc (maNoiDung) on delete restrict on update restrict;

alter table ChiTietNoiDung
add
    constraint FK_CHITIETN_CHITIETNO_TAIKHOAN foreign key (maSo) references TaiKhoan (maSo) on delete restrict on update restrict;

alter table ChiTietThongBao
add
    constraint FK_CHITIETT_CHITIETTH_TAIKHOAN foreign key (maSo) references TaiKhoan (maSo) on delete restrict on update restrict;

alter table ChiTietThongBao
add
    constraint FK_CHITIETT_CHITIETTH_THONGBAO foreign key (maThongBao) references ThongBao (maThongBao) on delete restrict on update restrict;

alter table DSKhachMoiThamDu
add
    constraint FK_DSKHACHM_DSKHACHMO_KHACHMOI foreign key (maKhachMoi) references KhachMoi (maKhachMoi) on delete restrict on update restrict;

alter table DSKhachMoiThamDu
add
    constraint FK_DSKHACHM_DSKHACHMO_NOIDUNGT foreign key (maNoiDung) references NoiDungToChuc (maNoiDung) on delete restrict on update restrict;

alter table DSSinhVienDangKy
add
    constraint FK_DSSINHVI_DSSINHVIE_HOATDONG foreign key (maHoatDong) references HoatDong (maHoatDong) on delete restrict on update restrict;

alter table DSSinhVienDangKy
add
    constraint FK_DSSINHVI_DSSINHVIE_TAIKHOAN foreign key (maSo) references TaiKhoan (maSo) on delete restrict on update restrict;

alter table HoatDong
add
    constraint FK_HOATDONG_RELATIONS_LOAIHOAT foreign key (maLoaiHoatDong) references LoaiHoatDong (maLoaiHoatDong) on delete restrict on update restrict;

alter table HoatDong
add
    constraint FK_HOATDONG_RELATIONS_TIEUCHI foreign key (maTieuChi) references TieuChi (maTieuChi) on delete restrict on update restrict;

alter table NoiDungToChuc
add
    constraint FK_NOIDUNGT_RELATIONS_HOATDONG foreign key (maHoatDong) references HoatDong (maHoatDong) on delete restrict on update restrict;
 
alter table PhieuDangKy
add
    constraint FK_PHIEUDAN_RELATIONS_TAIKHOAN foreign key (maSo) references TaiKhoan (maSo) on delete restrict on update restrict;

alter table PhieuDangKy
add
    constraint FK_PHIEUDAN_RELATIONS_HOATDONG foreign key (maHoatDong) references HoatDong (maHoatDong) on delete restrict on update restrict;
 
alter table TaiKhoan
add
    constraint FK_TAIKHOAN_RELATIONS_CHUCVU foreign key (maChucVu) references ChucVu (maChucVu) on delete restrict on update restrict;

alter table ThongBao
add
    constraint FK_THONGBAO_RELATIONS_HOATDONG foreign key (maHoatDong) references HoatDong (maHoatDong) on delete restrict on update restrict;