# 3licapps
0. Open terminal windows (Mở cửa sổ terminal để install libs)
1. cd ../3liapps (go to project folder) -> Trỏ tới thư mục chứa project 3liapps
2. npm install (to install node_modules) -> Gọi lệnh npm install để cài đặt node_module (libs)
3. npx jetify (if not foud error, then install -> npm install jetifier and run -> npx jetify again) -> Gọi lệnh npx jetify để fix androidX, nếu báo lỗi chưa cài đặt thì cài đặt bằng lệnh:  npm install jetifier, sau đó gọi lại lệnh npx jetify
4. cd ../ios -> Trỏ tới thư mục ios để cài đặt file pod
5. pod install -> Gọi lệnh để tạo file pod cho ios

Open chat3li.xcworkspace (in ios folder) -> To fix (Mở ios project lên để fix 1 số config của libs)
Fix Header Search Path PhotoView: (Có hình minh hoạ trong thư mục hotfix)
$(SRCROOT)/../../../ios/Pods/Headers/Public (Copy dòng này bỏ vào header searh path)

Fix Header Search Path SplashScreen: (Có hình minh hoạ trong thư mục hotfix)
$(SRCROOT)/../../../../ios/Pods/Headers/Public (Copy dòng này bỏ vào header searh path)

6. Enable PNS (Push) in ios -> 

