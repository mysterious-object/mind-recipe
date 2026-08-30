import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ThreeBrandMark extends StatefulWidget {
  const ThreeBrandMark({super.key});
  @override State<ThreeBrandMark> createState()=>_ThreeBrandMarkState();
}
class _ThreeBrandMarkState extends State<ThreeBrandMark>{
  WebViewController? controller;
  @override void initState(){super.initState();_open();}
  Future<void> _open() async {try{final c=WebViewController()..setJavaScriptMode(JavaScriptMode.unrestricted)..setBackgroundColor(Colors.transparent)..setNavigationDelegate(NavigationDelegate(onNavigationRequest:(r){final u=Uri.tryParse(r.url);return u!=null&&(u.scheme=='file'||u.host=='appassets.androidplatform.net')?NavigationDecision.navigate:NavigationDecision.prevent;}))..addJavaScriptChannel('BrandBridge',onMessageReceived:(_){})..loadFlutterAsset('assets/familiar/brand.html');if(mounted)setState(()=>controller=c);}catch(_){}}
  @override Widget build(BuildContext context)=>controller==null?Image.asset('assets/branding/mind-recipe-mark.png'):IgnorePointer(child:WebViewWidget(controller:controller!));
}
