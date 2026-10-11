---
title: PAD Searching Tool
tagline: Công cụ tìm monster Puzzle & Dragons, lọc theo đúng tác dụng của skill.
category: tools
status: live
year: 2024 – 2026
order: 2
stack:
  [NestJS, TypeORM, SQLite, React, TanStack Query, Capacitor, Docker, Terraform, Cloudflare Workers]
highlights:
  - Bộ lọc skill bằng regex kết hợp bộ lọc monster thông thường, giao diện ba cột.
  - API NestJS trên cơ sở dữ liệu cộng đồng DadGuide, có chức năng admin cập nhật dữ liệu.
  - Tự host trên VM Oracle Cloud sau Cloudflare Worker, dựng bằng Terraform; có bản Android qua Capacitor.
links:
  - { kind: live, url: 'https://pst.hassasin.com' }
  - { kind: repo, url: 'https://github.com/IAmHassasin/pad-searching-tool' }
---

Bắt đầu từ năm 2024 là một trang tìm kiếm tĩnh cho cộng đồng NA sau khi các công cụ bên thứ ba ngừng hoạt động. Giờ đây là dự án cá nhân hoạt động nhiều nhất của tôi: một ứng dụng full-stack tôi tự vận hành từ khâu nhập dữ liệu đến hạ tầng.
